const { MessageEmbed } = require('discord.js')
var kicked
module.exports = {
    name: "kick",
    description: "Kickea al usuario especificado.",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: 'usuario',
            description: 'Usuario a kickear.',
            type: 'USER',
            required: true,
        },
        {
            name: 'razon',
            description: 'Razón/Motivo para kickear al usuario.',
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
        
        client.config = require("../../config.json");
        
        const target = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('razon') || "No se especificó una razón.";
        try{
            let kickPermErr = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
            .setDescription("• Sólo sigo las órdenes de los mods.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            let banModErr = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
            .setDescription("• No tengo permiso para kickear a un mod.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

        let yourself = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Te kickeaste.**")
            .setDescription("• Espera, no puedes.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            let me = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:welldone:903316564487585832> ¿Quieres deshacerte de mí?.**")
            .setDescription("• Eres malo.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            if (target.user.id == interaction.member.user.id) {
                interaction.followUp({
                    embeds: [yourself]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }

            if (target.user.id == '953705293345325146') {
                interaction.followUp({
                    embeds: [me]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }

        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            interaction.followUp({
                embeds: [kickPermErr]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }
        if (target.roles.highest.position >=
            interaction.member.roles.highest.position
        ) {
            interaction.followUp({ embeds: [kickModErr] })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }
    }
        catch(error){
            let something = new MessageEmbed()
            .setColor('RED')
        .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
        .setDescription(`${error}`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`);
            interaction.followUp({
                embeds: [something]
            })                .then(msg => {
                setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
            })
        return
        }
        const kickembed = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`**<:redwarn:903008123550335046> ${target.user.tag} ha sido kickeado.**`)
            .setDescription("Más información abajo.")
            .addField(`**• Razón:**`, `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

        const kickdm = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTitle("**<:redwarn:903008123550335046> Has sido kickeado de Miko Gang.**")
            .setDescription("Más detalles abajo.")
            .addField(`**• Razón:**`, `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

          
        let kickLog = new MessageEmbed()
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .setTitle(`**<:redwarn:903008123550335046> Un usuario ha sido kickeado.**`)
        .addField("**• Usuario**", `${target.user.tag}`)
        .addField("**• Razón**", `\`${reason}\``)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        client.channels.cache.get(client.config.strikeslogchannel).send({embeds: [kickLog]})
  
        target.send({embeds: [kickdm]}).catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`))
        setTimeout(() => { target.kick(reason) }, 500)
        interaction.followUp({
            embeds: [kickembed]
        })
    }
}