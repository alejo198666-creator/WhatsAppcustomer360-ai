/**
 * ===========================================================
 * useAdminShortcut.js
 * -----------------------------------------------------------
 * Hook encargado de detectar la combinación de teclas que
 * abre el acceso administrativo.
 *
 * Combinación actual:
 *
 * Ctrl + Shift + A
 *
 * En macOS también se permite:
 *
 * Command + Shift + A
 *
 * Este hook no abre directamente el panel administrativo.
 * Únicamente ejecuta la función recibida mediante onActivate.
 * ===========================================================
 */

import {
    useEffect
} from "react";

/**
 * Detecta la combinación administrativa del teclado.
 *
 * @param {Object} options
 * @param {Function} options.onActivate
 * Función que se ejecutará al detectar el atajo.
 *
 * @param {boolean} [options.enabled=true]
 * Permite activar o desactivar temporalmente el atajo.
 */
export function useAdminShortcut({
    onActivate,
    enabled = true
}) {

    useEffect(
        () => {

            /*
             * Si el atajo está desactivado, no registramos
             * ningún evento en el documento.
             */
            if (!enabled) {

                return undefined;

            }

            /**
             * Procesa cada pulsación del teclado.
             *
             * @param {KeyboardEvent} event
             */
            function handleKeyDown(event) {

                const pressedKey =
                    String(event.key ?? "")
                        .toLowerCase();

                const hasControlKey =
                    event.ctrlKey || event.metaKey;

                const isAdminShortcut =
                    hasControlKey &&
                    event.shiftKey &&
                    pressedKey === "a";

                if (!isAdminShortcut) {

                    return;

                }

                /*
                 * Evita que el navegador o algún componente
                 * procese adicionalmente la combinación.
                 */
                event.preventDefault();

                if (typeof onActivate === "function") {

                    onActivate();

                }

            }

            document.addEventListener(
                "keydown",
                handleKeyDown
            );

            /*
             * React ejecutará esta limpieza cuando el
             * componente se desmonte o cambien las
             * dependencias del efecto.
             */
            return () => {

                document.removeEventListener(
                    "keydown",
                    handleKeyDown
                );

            };

        },
        [
            enabled,
            onActivate
        ]
    );

}