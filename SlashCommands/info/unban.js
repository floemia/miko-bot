const { MessageEmbed, User } = require('discord.js')
module.exports = {
    name: "unban",
    description: "Desbanea al usuario especificado.",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: 'usuario',
            description: 'Pega aquí el ID del usuario que quieres desbanear.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'razon',
            description: 'Razón para desbanear al usuario.',
            type: 'STRING',
            required: false,
        },

    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, message) => {
        const logchannel = require('../../config.json');
        const target = interaction.options.getString('usuario');
        const reason = interaction.options.getString('razon') || "No se especificó una razón.";
        let banPermErr = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
        .setDescription("• Sólo sigo las órdenes de los mods.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        let banModErr = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
        .setDescription("• No puedo desbanear a un mod. Ni siquiera está baneado.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        let me = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> Lo haría, pero...**")
        .setDescription("• No estoy baneada.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

    let yourself = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> Te desbaneaste.**")
        .setDescription("• Espera, no puedes.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()
            if (target == interaction.member.user) {
                interaction.followUp({
                    embeds: [yourself]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            
        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            interaction.followUp({
                embeds: [banPermErr]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }

        if (target == '953705293345325146') {
            interaction.followUp({
                embeds: [me]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }


        
        interaction.guild.members
        .unban(target)
        .then((user) => {
            let unbanembed = new MessageEmbed()
            .setTitle(`**<:greencheck:889877751744577627> Buenas noticias para ${user.tag}.**`)
            .setThumbnail(user.displayAvatarURL({ size:2048, dynamic: true }))
            .setColor('#43B581')
            .setDescription('Ha sido desbaneado.')
            .addField("**• Razón**", `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            let unbanLog = new MessageEmbed()
            .setColor('#43B581')
            .setTitle("**<:greencheck:900148615677358090> Un usuario ha sido desbaneado.**")
            .setThumbnail(user.displayAvatarURL({ size:2048, dynamic: true }))
            .addField("**• Usuario**", `${user.tag}`)
            .addField("**• Razón**", `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
            client.channels.cache.get(client.config.logchannel).send({embeds: [unbanLog]})
            interaction.followUp({
                embeds: [unbanembed]
                
            })
        })
        .catch(error => { console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
        let something = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
        .setDescription("• La próxima vez menciona a un usuario baneado.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()
        interaction.followUp({
            embeds: [something]
        })
        .then(msg => {
            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
        })
    return
    })

        

    

    }
}