/**
 * ===========================================================
 * storageService.js
 * -----------------------------------------------------------
 * Centraliza la persistencia local del prototipo Customer360.
 *
 * Responsabilidades:
 *
 * - Guardar y recuperar clientes.
 * - Guardar y recuperar pedidos.
 * - Persistir el consecutivo de pedidos.
 * - Proteger la aplicación ante datos dañados.
 * - Funcionar también durante pruebas ejecutadas con Node.js.
 *
 * Los repositorios utilizarán este servicio en lugar de
 * acceder directamente a localStorage.
 * ===========================================================
 */

/**
 * Claves utilizadas dentro de localStorage.
 *
 * Se utiliza un prefijo propio para evitar conflictos con
 * información de otras aplicaciones del navegador.
 */
const STORAGE_KEYS = Object.freeze({
    CLIENTES: "customer360_clientes",
    PEDIDOS: "customer360_pedidos",
    ORDER_SEQUENCE: "customer360_order_sequence"
});

/**
 * Almacenamiento alternativo en memoria.
 *
 * Se utiliza cuando localStorage no está disponible, por
 * ejemplo, durante las pruebas automatizadas con Node.js.
 */
const memoryStorage = new Map();

/**
 * Determina si localStorage está disponible.
 *
 * @returns {boolean}
 */
function isLocalStorageAvailable() {

    try {

        return (
            typeof window !== "undefined" &&
            typeof window.localStorage !== "undefined"
        );

    } catch {

        return false;

    }

}

/**
 * Lee un valor del mecanismo de almacenamiento disponible.
 *
 * @param {string} key
 * @returns {string|null}
 */
function readRawValue(key) {

    if (isLocalStorageAvailable()) {

        try {

            return window.localStorage.getItem(key);

        } catch (error) {

            console.warn(
                `No fue posible leer la clave "${key}" de localStorage.`,
                error
            );

        }

    }

    return memoryStorage.get(key) ?? null;

}

/**
 * Guarda un valor en el mecanismo de almacenamiento disponible.
 *
 * @param {string} key
 * @param {string} value
 */
function writeRawValue(key, value) {

    if (isLocalStorageAvailable()) {

        try {

            window.localStorage.setItem(key, value);
            return;

        } catch (error) {

            console.warn(
                `No fue posible guardar la clave "${key}" en localStorage.`,
                error
            );

        }

    }

    memoryStorage.set(key, value);

}

/**
 * Elimina un valor del mecanismo de almacenamiento disponible.
 *
 * @param {string} key
 */
function removeRawValue(key) {

    if (isLocalStorageAvailable()) {

        try {

            window.localStorage.removeItem(key);

        } catch (error) {

            console.warn(
                `No fue posible eliminar la clave "${key}" de localStorage.`,
                error
            );

        }

    }

    memoryStorage.delete(key);

}

/**
 * Crea una copia profunda utilizando JSON.
 *
 * Los objetos almacenados actualmente contienen únicamente
 * valores serializables.
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
function cloneValue(value) {

    return JSON.parse(
        JSON.stringify(value)
    );

}

/**
 * Convierte de forma segura un texto JSON en un arreglo.
 *
 * Si la información está dañada o no corresponde a un arreglo,
 * devuelve una colección vacía.
 *
 * @param {string|null} rawValue
 * @returns {Array}
 */
function parseArray(rawValue) {

    if (!rawValue) {
        return [];
    }

    try {

        const parsedValue =
            JSON.parse(rawValue);

        return Array.isArray(parsedValue)
            ? parsedValue
            : [];

    } catch (error) {

        console.warn(
            "Se encontró información dañada en el almacenamiento local.",
            error
        );

        return [];

    }

}

/**
 * Guarda todos los clientes.
 *
 * @param {Array} clientes
 */
export function saveClientes(clientes) {

    if (!Array.isArray(clientes)) {

        throw new TypeError(
            "Los clientes deben enviarse como un arreglo."
        );

    }

    writeRawValue(
        STORAGE_KEYS.CLIENTES,
        JSON.stringify(clientes)
    );

}

/**
 * Recupera los clientes guardados.
 *
 * @returns {Array}
 */
export function loadClientes() {

    const clientes = parseArray(
        readRawValue(STORAGE_KEYS.CLIENTES)
    );

    return cloneValue(clientes);

}

/**
 * Guarda todos los pedidos.
 *
 * @param {Array} pedidos
 */
export function savePedidos(pedidos) {

    if (!Array.isArray(pedidos)) {

        throw new TypeError(
            "Los pedidos deben enviarse como un arreglo."
        );

    }

    writeRawValue(
        STORAGE_KEYS.PEDIDOS,
        JSON.stringify(pedidos)
    );

}

/**
 * Recupera los pedidos guardados.
 *
 * @returns {Array}
 */
export function loadPedidos() {

    const pedidos = parseArray(
        readRawValue(STORAGE_KEYS.PEDIDOS)
    );

    return cloneValue(pedidos);

}

/**
 * Guarda el valor actual del consecutivo de pedidos.
 *
 * @param {number} sequence
 */
export function saveOrderSequence(sequence) {

    const numericSequence =
        Number(sequence);

    if (
        !Number.isInteger(numericSequence) ||
        numericSequence < 0
    ) {

        throw new TypeError(
            "El consecutivo del pedido debe ser un entero mayor o igual que cero."
        );

    }

    writeRawValue(
        STORAGE_KEYS.ORDER_SEQUENCE,
        String(numericSequence)
    );

}

/**
 * Recupera el consecutivo guardado.
 *
 * @returns {number}
 */
export function loadOrderSequence() {

    const rawSequence =
        readRawValue(
            STORAGE_KEYS.ORDER_SEQUENCE
        );

    const numericSequence =
        Number(rawSequence);

    if (
        !Number.isInteger(numericSequence) ||
        numericSequence < 0
    ) {

        return 0;

    }

    return numericSequence;

}

/**
 * Obtiene y guarda el siguiente consecutivo.
 *
 * @returns {number}
 */
export function nextOrderSequence() {

    const currentSequence =
        loadOrderSequence();

    const nextSequence =
        currentSequence + 1;

    saveOrderSequence(nextSequence);

    return nextSequence;

}

/**
 * Elimina únicamente los clientes almacenados.
 */
export function clearClientesStorage() {

    removeRawValue(
        STORAGE_KEYS.CLIENTES
    );

}

/**
 * Elimina únicamente los pedidos almacenados.
 */
export function clearPedidosStorage() {

    removeRawValue(
        STORAGE_KEYS.PEDIDOS
    );

}

/**
 * Reinicia únicamente el consecutivo.
 */
export function clearOrderSequenceStorage() {

    removeRawValue(
        STORAGE_KEYS.ORDER_SEQUENCE
    );

}

/**
 * Elimina toda la información persistida por Customer360.
 *
 * Esta función será especialmente útil en pruebas y durante
 * el desarrollo.
 */
export function clearDatabaseStorage() {

    clearClientesStorage();
    clearPedidosStorage();
    clearOrderSequenceStorage();

}

/**
 * Expone las claves únicamente para pruebas o diagnóstico.
 *
 * No deben utilizarse directamente desde componentes o flujos.
 */
export const storageKeys = STORAGE_KEYS;