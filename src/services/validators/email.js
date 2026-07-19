/**
 * Realiza una validación básica de correo electrónico.
 *
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email.trim());

}