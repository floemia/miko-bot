const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const moment = require('moment');
module.exports = {
    name: "pregunta",
    description: "Pregúntame algo. Te responderé con sí o no.",
    options: [
        {
            name: 'pregunta',
            description: 'La pregunta que quieres hacerme.',
            type: 'STRING',
            required: true,
        }
    ],
        /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args, message) => {

    const pregunta = interaction.options.getString('pregunta')
        const respuestas =
        [
            "Definitivamente.",
            "¿Por qué me preguntas eso?",
            "No tengo idea.",
            "Inténtalo más tarde, no estoy de humor.",
            "Pregúntaselo a tus amiguitas.",
            "Estás en lo correcto.",
            "SÍ, SIN DUDARLO.",
            "Cómprame una coca de vidrio y te responderé.",
            "Emm... no.",
            "Tal vez.",
            "No estoy segura.",
            "Estoy 75% segura que sí.",
            "Probablemente no.",
            "Probablemente sí.",
            "Que te lo digan tus amiguitas.",
            "No quiero responder.",
            "Estoy 80% segura que no.",
            "No es cierto.",
            "Definitivamente no.",
            "No.",
            "Sí.",
            "Depende.",
            "floemia lo sabe. Pregúntaselo.",
            "Puede ser.",
            "Quién sabe.",
            "50% sí y 50% no. No sé.",
            "Estoy 65% segura que sí.",
            "Estoy 95% segura que sí.",
            "Estoy 99% segura que sí.",
            "Estoy 75% segura que no.",
            "Estoy 55% segura que no.",
            "Estoy 95% segura que no.",
            "Los martes sí.",
            "A veces.",
            "No respondo gratis. A veces.",
            "¿Qué?",
            "¿Pero qué dices?",
            "NO, SIN DUDARLO.",
            "Ni un poquito.",
            "Totalmente.",
            "Efectivamente.",
            "Afirmativo.",
            "Negativo.",
            "Lo dudo.",
            "callese",
            "Parcialmente.",
            "No sé qué decir.",
            "¿Se supone que debo responder a eso?",
            "La moneda cayó en cruz. Es un sí.",
            "La moneda cayó en cara. Es un no.",
            "Absolutamente equivocado.",
            "A veces sí, a veces no.",
            "Te dejaré con la intriga.",
            "Piénsalo.",
            "No te responderé nada.",
            "Andaba durmiendo y me despertaste, genial.",
            "No lo sé, la verdad.",
            
        ]

const int = Math.floor(Math.random() * (56 - 0)) + 0;
        

        const embed1 = new Discord.MessageEmbed()
        .setColor('#dedede')
        .addField(`Tu pregunta`, `• ${pregunta}`)
        .addField(`Mi respuesta`, `• ${respuestas[int]} `)
        .setTimestamp()
        
        interaction.followUp({
            embeds: [embed1]
        })

    }}