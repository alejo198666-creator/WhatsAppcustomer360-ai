/**
 * =====================================================
 * clienteRepository.js
 * -----------------------------------------------------
 * Simula el acceso a la base de datos de clientes.
 * En futuras versiones este repositorio consultará
 * una API REST desarrollada en FastAPI.
 * =====================================================
 */

import { clientes } from "../../data/fakeDB";

/**
 * Obtiene todos los clientes registrados.
 */
export function getClientes() {

    return clientes;

}

/**
 * Busca un cliente por número de WhatsApp.
 *
 * @param {string} telefono
 * @returns Cliente | undefined
 */
export function buscarClientePorTelefono(telefono){

    return clientes.find(
        c => c.telefono === telefono
    );

}