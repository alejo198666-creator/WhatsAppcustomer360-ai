/**
 * ===========================================================
 * clienteRepository.js
 * -----------------------------------------------------------
 * Repositorio de clientes.
 *
 * Actualmente utiliza fakeDB como almacenamiento en memoria
 * y storageService para persistir los datos en localStorage.
 *
 * En una futura versión realizará solicitudes HTTP hacia
 * FastAPI.
 * ===========================================================
 */

import {
    clientes
} from "../../data/fakeDB.js";

import {
    saveClientes,
    clearClientesStorage
} from "../storage/storageService.js";

/**
 * Crea una copia segura de un cliente.
 *
 * @param {Object} customer
 * @returns {Object}
 */
function cloneCustomer(customer) {

    return {
        ...customer
    };

}

/**
 * Obtiene todos los clientes registrados.
 *
 * @returns {Array}
 */
export function getClientes() {

    return clientes.map(
        (customer) => cloneCustomer(customer)
    );

}

/**
 * Busca un cliente por número de WhatsApp.
 *
 * @param {string} telefono
 * @returns {Object|undefined}
 */
export function buscarClientePorTelefono(telefono) {

    const normalizedPhone =
        String(telefono ?? "").trim();

    const customer = clientes.find(
        (item) =>
            item.telefono === normalizedPhone
    );

    return customer
        ? cloneCustomer(customer)
        : undefined;

}

/**
 * Guarda un cliente y actualiza localStorage.
 *
 * @param {Object} customer
 * @returns {Object}
 */
export function guardarCliente(customer) {

    if (!customer || typeof customer !== "object") {

        throw new TypeError(
            "No se puede guardar un cliente inválido."
        );

    }

    const normalizedPhone =
        String(customer.telefono ?? "").trim();

    if (!normalizedPhone) {

        throw new TypeError(
            "El cliente debe tener un número de teléfono."
        );

    }

    const existingCustomer =
        buscarClientePorTelefono(normalizedPhone);

    if (existingCustomer) {

        throw new Error(
            "Ya existe un cliente registrado con este número de teléfono."
        );

    }

    const customerCopy = cloneCustomer({
        ...customer,
        telefono: normalizedPhone
    });

    clientes.push(customerCopy);

    /*
     * Persistimos toda la colección después de modificarla.
     */
    saveClientes(clientes);

    return cloneCustomer(customerCopy);

}

/**
 * Actualiza la información de un cliente.
 *
 * @param {string} telefono
 * @param {Object} changes
 * @returns {Object|null}
 */
export function actualizarCliente(
    telefono,
    changes
) {

    const normalizedPhone =
        String(telefono ?? "").trim();

    const customerIndex =
        clientes.findIndex(
            (item) =>
                item.telefono === normalizedPhone
        );

    if (customerIndex === -1) {

        return null;

    }

    const updatedCustomer = {
        ...clientes[customerIndex],
        ...changes,

        /*
         * El teléfono original se conserva como identificador.
         */
        telefono: normalizedPhone
    };

    clientes[customerIndex] =
        updatedCustomer;

    saveClientes(clientes);

    return cloneCustomer(updatedCustomer);

}

/**
 * Elimina los clientes almacenados.
 *
 * Se utiliza principalmente durante pruebas o desarrollo.
 */
export function limpiarClientes() {

    clientes.splice(
        0,
        clientes.length
    );

    clearClientesStorage();

}
/**
 * Devuelve los clientes únicos consolidados a partir
 * de los pedidos registrados.
 *
 * El resultado se ordena por la fecha del pedido más
 * reciente.
 *
 * @returns {Object[]}
 */
export function obtenerClientes() {

    const storedOrders =
        obtenerPedidos();

    const orders =
        Array.isArray(storedOrders)
            ? storedOrders
            : [];

    const clientsMap =
        new Map();

    orders.forEach(
        (order) => {

            const clientData =
                extractClientFromOrder(
                    order
                );

            const clientKey =
                buildClientKey(
                    clientData
                );

            /*
             * Los pedidos sin ninguna identificación de
             * cliente no se incluyen en el consolidado.
             */
            if (!clientKey) {

                return;

            }

            const existingClient =
                clientsMap.get(
                    clientKey
                );

            if (!existingClient) {

                clientsMap.set(
                    clientKey,
                    createClientRecord(
                        clientKey,
                        clientData,
                        order
                    )
                );

                return;

            }

            mergeOrderIntoClient(
                existingClient,
                clientData,
                order
            );

        }
    );

    return Array.from(
        clientsMap.values()
    )
        .sort(
            (
                firstClient,
                secondClient
            ) =>
                getTimestamp(
                    secondClient.ultimoPedido
                ) -
                getTimestamp(
                    firstClient.ultimoPedido
                )
        )
        .map(
            (client) => ({
                ...client,
                pedidoIds: [
                    ...client.pedidoIds
                ]
            })
        );

}