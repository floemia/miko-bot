const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const moment = require('moment');
module.exports = {
    name: "acerca",
    description: "Acerca de mí.",
        /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args, message) => {
        const embed1 = new Discord.MessageEmbed()
        .setTitle(`**<:graycheck:903741976061567027> Sobre mí.**`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setColor('#dedede')
        .addField(`• Desarrollado por`, `<@596481414426525696>`)
        .addField(`• Motor`, `Node.js v17.1.0`, true)
        .addField(`• Versión de discord.js`, `v13.2.0`, true)
        .addField(`• v1.0 (16/03/2022)`, `Debut oficial en el servidor.`)
        .addField(`• Agradecimientos`, `Un saludo a reconlx por el command handler.`)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()
        interaction.followUp({
            embeds: [embed1]
        })

    }}