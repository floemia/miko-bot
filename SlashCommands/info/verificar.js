const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const moment = require('moment');

module.exports = {
    name: "verificar",
    description: "Verifica a un usuario.",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: 'usuario',
            description: 'Usuario a verificar.',
            type: 'USER',
            required: true,
        },

    ],
    /**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {String[]} args
 */

    run: async (client, interaction, args, message) => {
        client.config = require("../../config.json");
        try {
            const target = interaction.options.getMember('usuario');

            const verifRole = interaction.guild.roles.cache.find(
                (role) => role.name === "Sin verificar")
            const Miembro = interaction.guild.roles.cache.find(
                (role) => role.name === "Miembro")

            if (!interaction.channel.name.includes("ticket-")) {
                let noChannel = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> No puedes hacer eso aquí.**")
                .setDescription(`• Debes ir a un canal de tickets.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()
                interaction.followUp({
                    embeds: [noChannel]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /verificar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        return
                    })
                return
            }

            else {
                const embedverify = new MessageEmbed()
                    .setColor('#43B581')
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`**<:greencheck:900148615677358090> ${target.user.tag} ha sido verificado.**`)
                    .setDescription("• Puedes eliminar este canal ahora, si lo deseas. Se borrará automáticamente en 10 segundos.")
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                let alrver = new MessageEmbed()
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setColor('RED')
                    .setTitle(`**<:redwarn:903008123550335046> ${target.user.tag} ya es un miembro.**`)
                    .setDescription("• La próxima vez menciona a alguien que no lo sea.")
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                if (target.roles.cache.has(Miembro.id) || target.user.bot) {
                    interaction.followUp({
                        embeds: [alrver]
                    })
                        .then(msg => {
                            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /verificar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                            return
                        })
                    return
                }
                target.roles.remove(verifRole)
                target.roles.add(Miembro)
                interaction.followUp({
                    embeds: [embedverify]
                })

                    setTimeout(() => {
                        const channelName = interaction.channel.name.replace('︙ticket-', '')
                        const ticketLog = new MessageEmbed()
                        .setColor('#43B581')
                        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                        .setTitle(`**<:greencheck:900148615677358090> Se cerró el ticket para ${target.user.tag}.**`)
                        .setDescription(`• El ticket era ${channelName}. El usuario ya ha sido verificado.`)
                        .setFooter(`Miko`, client.user.displayAvatarURL())
                        .setTimestamp()
                        
                        client.channels.cache.get(client.config.ticketlogchannel).send({ embeds: [ticketLog] })
                        interaction.channel.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /verificar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`))

                    }, 10000)

            }
        } catch (error) {
            let something = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                .setDescription(`${error}`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()
            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /verificar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`);
            interaction.followUp({
                embeds: [something]
            }).then(msg => {
                setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /verificar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
            })
            return
        }

    }
}