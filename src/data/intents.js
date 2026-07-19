const intents = [

  {
    keywords: [
      "consultar pedido",
      "estado pedido",
      "consulta pedido",
      "pedido"
    ],
    response:
`Perfecto.

Indícame el número del pedido para realizar la consulta.`
  },

  {
    keywords: [
      "nuevo cliente",
      "registrar cliente",
      "crear cliente",
      "cliente"
    ],
    response:
`Perfecto.

Vamos a registrar un nuevo cliente.`
  },

  {
    keywords: [
      "nueva venta",
      "registrar venta",
      "venta",
      "vender"
    ],
    response:
`Perfecto 👍

Vamos a registrar una nueva venta.`
  },

  {
    keywords: [
      "hola",
      "buenas",
      "buen día",
      "buenos días",
      "buenas tardes"
    ],
    response:
`Hola 👋

Soy Customer360 AI.

Puedo ayudarte con:

• Registrar ventas
• Registrar clientes
• Consultar pedidos
¿Qué deseas hacer?`
  }

];

export default intents;