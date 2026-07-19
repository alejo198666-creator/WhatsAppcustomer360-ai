/**
 * ========================================================
 * productoRepository.js
 * --------------------------------------------------------
 * Acceso al catálogo de productos.
 * ========================================================
 */

import { productos } from "../../data/productos";

/**
 * Devuelve todo el catálogo.
 */
export function obtenerProductos(){

    return productos;

}

/**
 * Busca un producto por ID.
 */
export function buscarProducto(id){

    return productos.find(

        p=>p.id===Number(id)

    );

}