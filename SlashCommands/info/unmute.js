const { MessageEmbed } = require('discord.js')
const ms = require('ms')
module.exports = {
    name: "unmute",
    description: "Desmutea al usuario especificado.",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: 'usuario',
            description: 'Usuario a desmutear.',
            type: 'USER',
            required: true,
        },
        {
            name: 'razon',
            description: 'Razón para desmutear al usuario.',
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
        const guild = client.config.guild
        client.config = require("../../config.json");
        const gakusei = interaction.guild.roles.cache.find(
            (role) => role.name === "Miembro")
        const muteRole = interaction.guild.roles.cache.find(
            (role) => role.name === "Muted")

        const target = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('razon') || "No se especificó una razón.";
        try {
            let banPermErr = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
        .setDescription("• Sólo sigo las órdenes de los mods.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        let banModErr = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
        .setDescription("• No puedo desmutear a un mod. Ni siquiera está muteado.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        let me = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> Lo haría, pero...**")
        .setDescription("• No estoy muteada.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

    let yourself = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> Te desmuteaste.**")
        .setDescription("• Espera, no puedes.")
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()
            if (target.user.id == interaction.member.user.id) {
                interaction.followUp({
                    embeds: [yourself]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unmute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }

            if (target.user.id == '953705293345325146') {
                interaction.followUp({
                    embeds: [me]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unmute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }

            if (!interaction.member.permissions.has("MANAGE_MEMBERS")) {
                interaction.followUp({
                    embeds: [mutePermErr]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unmute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            if (target.roles.highest.position >=
                interaction.member.roles.highest.position
            ) {
                interaction.followUp({ embeds: [muteModErr] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unmute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
        }
        catch (error) {
            let something = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                .setDescription(`${error}`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()
            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`);
            interaction.followUp({
                embeds: [something]
            }).then(msg => {
                setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unmute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
            })
            return
        }



        let alrmute = new MessageEmbed()
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setTitle(`**<:redwarn:903008123550335046> ${target.user.tag} no está muteado.**`)
            .setDescription("• Selecciona a un usuario muteado la próxima vez.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
        if (!target.roles.cache.has(muteRole.id)) {
            interaction.followUp({
                embeds: [alrmute]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /unmute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    return
                })
                return
        }

        const unmuteembed = new MessageEmbed()
            .setColor('#43B581')
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`**<:greencheck:900148615677358090> ${target.user.tag} ha sido manualmente desmuteado.**`)
            .setDescription("Bienvenido, otra vez.")
            .addField(`**• Razón:**`, `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

        let unmuteLog = new MessageEmbed()
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setColor('#43B581')
            .setTitle(`**<:greencheck:900148615677358090> Un usuario ha sido manualmente desmuteado.**`)
            .addField("**• Usuario**", `${target.user.tag}`)
            .addField("**• Razón**", `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
        client.channels.cache.get(client.config.logchannel).send({ embeds: [unmuteLog] })
        setTimeout(() => {target.roles.remove(muteRole) }, 500)
        interaction.followUp({
            content: `<@${target.user.id}>`,
            embeds: [unmuteembed]
        })

    }
}
