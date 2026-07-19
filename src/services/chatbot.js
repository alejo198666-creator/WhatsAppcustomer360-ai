import intents from "../data/intents";
import { conversation } from "./conversationState";
import { clientes } from "../data/fakeDB";
import { iniciarVenta,  procesarVenta} from "./flows/ventaFlow";
export function chatbot(message) {

    const text = message.trim();

    //---------------------------------------------------
    // SI YA ESTAMOS EN EL FLUJO DE REGISTRO
    //---------------------------------------------------

    if (conversation.flow === "cliente") {

        switch (conversation.step) {

            case "nombre":

                conversation.cliente.nombre = text;

                conversation.step = "telefono";

                return "📱 ¿Cuál es el número de WhatsApp del cliente?";

            case "telefono":

                if (!/^[0-9]{10}$/.test(text)) {

                    return "El número debe tener 10 dígitos.";

                }

                conversation.cliente.telefono = text;

                conversation.step = "correo";

                return "📧 ¿Cuál es el correo electrónico?";

            case "correo":

                if (!text.includes("@")) {

                    return "Ingresa un correo válido.";

                }

                conversation.cliente.correo = text;

                conversation.step = "direccion";

                return "🏠 ¿Cuál es la dirección del cliente?";

            case "direccion":

                conversation.cliente.direccion = text;

                clientes.push(conversation.cliente);

                conversation.flow = null;
                conversation.step = null;
                conversation.cliente = {};

                return `✅ Cliente registrado correctamente.

Actualmente existen ${clientes.length} cliente(s) registrados.

¿Qué deseas hacer ahora?`;

        }

    }

    //---------------------------------------------------
    // INICIAR REGISTRO DE CLIENTE
    //---------------------------------------------------

    if (text.toLowerCase().includes("cliente")) {

        conversation.flow = "cliente";

        conversation.step = "nombre";

        conversation.cliente = {};

        return `Perfecto 👍

Vamos a registrar un nuevo cliente.

👤 ¿Cuál es el nombre completo?`;

    }

    //---------------------------------------------------
    // RESPUESTAS NORMALES
    //---------------------------------------------------
	//------------------------------------------------------
    // Flujo de ventas
   //------------------------------------------------------

    if(conversation.flow==="venta"){

    return procesarVenta(message);

    }
	
	if(text.toLowerCase().includes("venta")){

    return iniciarVenta();

    }

    const lower = text.toLowerCase();

    for (const intent of intents) {

        for (const keyword of intent.keywords) {

            if (lower.includes(keyword.toLowerCase())) {

                return intent.response;

            }

        }

    }

    return "Lo siento, no entendí la solicitud.";

}