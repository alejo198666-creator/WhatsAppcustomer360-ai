/**
 * Valida un número colombiano básico de 10 dígitos.
 *
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {

    return /^[0-9]{10}$/.test(phone.trim());

}