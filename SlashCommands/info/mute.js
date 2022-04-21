const { MessageEmbed } = require('discord.js')
const ms = require("ms") 
const muteModel = require('../../models/muteModel')
module.exports = {
    name: "mute",
    description: "Mutea al usuario especificado.",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: 'usuario',
            description: 'Usuario a mutear.',
            type: 'USER',
            required: true,
        },
        {
            name: 'razon',
            description: 'Razón/Motivo para mutear a este usuario.',
            type: 'STRING',
            required: false,
        },
        {
            name: 'tiempo',
            description: 'El tiempo que será muteado. En blanco, el usuario será muteado permanentemente.',
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
        const time = interaction.options.getString('tiempo');
        try {

        let muteModErr = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
            .setDescription("• No tengo permiso para mutear a un mod.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

        let yourself = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Te muteaste.**")
            .setDescription("• Espera. No puedes.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            let me = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:welldone:903316564487585832> ¿Quieres callarme?.**")
            .setDescription("• Eres malo.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
            if (target.user.id == interaction.member.user.id) {
                interaction.followUp({
                    embeds: [yourself]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }

            if (target.user.id == '953705293345325146') {
                interaction.followUp({
                    embeds: [me]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }

            if (target.roles.highest.position >=
                interaction.member.roles.highest.position
            ) {
                interaction.followUp({ embeds: [muteModErr] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
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
            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`);
            interaction.followUp({
                embeds: [something]
            }).then(msg => {
                setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
            })
            return
        }
      
        let alrmute = new MessageEmbed()
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setTitle(`**<:redwarn:903008123550335046> ${target.user.tag} ya está muteado.**`)
            .setDescription("• La próxima vez menciona a alguien no muteado.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
        if (target.roles.cache.has(muteRole.id)) {
            interaction.followUp({
                embeds: [alrmute]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    return
                })
            return
        }
        if (time == undefined) {
            // new muteModel({
            //     guildid: interaction.guildId,
            //     user: target.id,
            //     moderatorId: interaction.member.id,
            //     reason,
            //     duration: '2500',
            //     timestamp: Date.now()
            // }).save();

            // const mutedata = await muteModel.findOne({ user: target.user.id })
            const permamuteembed = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`**<:redwarn:903008123550335046> ${target.user.tag} ha sido permanentemente muteado**`)
            .setDescription("Suficiente.")
            .addField(`**• Razón:**`, `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

        const permamutedm = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTitle("**<:redwarn:903008123550335046> Has sido muteado permanentemente en Miko Gang.**")
            .setDescription("Más detalles abajo.")
            .addField(`**• Razón:**`, `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()


        let permamuteLog = new MessageEmbed()
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setTitle(`**<:redwarn:903008123550335046> Un usuario ha sido permanentemente muteado.**`)
            .addField("**• Usuario**", `${target.user.tag}`)
            // .addField(`**• Mute ID:**`, `\`${mutedata._id}\``)
            .addField("**• Razón**", `\`${reason}\``)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            client.channels.cache.get(client.config.logchannel).send({ embeds: [permamuteLog] })
            target.send({ embeds: [permamutedm] }).catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`))
            setTimeout(() => { target.roles.add(muteRole)  }, 500)
            interaction.followUp({
                content: `<@${target.user.id}>`,
                embeds: [permamuteembed]
            })
            return
        }
        else {
            try {
               

                    // new muteModel({
                    //     guildid: interaction.guildId,
                    //     user: target.id,
                    //     moderatorId: interaction.member.id,
                    //     reason,
                    //     duration: ms.format(time),
                    //     timestamp: Date.now()
                    // }).save();

                    // const mutedata = await muteModel.findOne({ user: target.user.id })
                    var stringTime = ms(ms(time), { long: true })
                    var traducidoTime
                    var mapObj = {
                        miliseconds:"milisegundos",
                        milisecond:"milisegundo",
                        seconds:"segundos",
                        second:"segundo",
                        minutes:"minutos",
                        minute:"minuto",
                        hours:"horas",
                        hour:"hora",
                        days:"días",
                        day:"día",
                        weeks:"semanas",
                        week:"semana",
                        year:"año",
                        years:"años"
                    };
                     traducidoTime = stringTime.replace(/\b(?:miliseconds|milisecond|seconds|second|minutes|minute|hours|hour|days|day|weeks|week|year|years)\b/gi, matched => mapObj[matched]);
                    const muteembed = new MessageEmbed()
                    
                    .setColor('RED')
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`**<:redwarn:903008123550335046> ${target.user.tag} ha sido muteado.**`)
                    .setDescription("Suficiente.")
                    .addField(`**• Razón:**`, `\`${reason}\``)
                    .addField(`**• Duración:**`, `\`${traducidoTime}\``)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                const mutedm = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setTitle("**<:redwarn:903008123550335046> Has sido muteado en Miko Gang.**")
                    .setDescription("Más detalles abajo.")
                    .addField(`**• Razón:**`, `\`${reason}\``)
                    .addField(`**• Duración:**`, `\`${traducidoTime}\``)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()


                let muteLog = new MessageEmbed()
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setColor('RED')
                    .setTitle(`**<:redwarn:903008123550335046> Un usuario ha sido muteado.**`)
                    .addField("**• Usuario**", `${target.user.tag}`)
                    // .addField(`**• Mute ID:**`, `\`${mutedata._id}\``)
                    .addField("**• Razón**", `\`${reason}\``)
                    .addField(`**• Duración:**`, `\`${traducidoTime}\``)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                client.channels.cache.get(client.config.logchannel).send({ embeds: [muteLog] })
                target.send({ embeds: [mutedm] }).catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`))
                setTimeout(() => { target.roles.add(muteRole)}, 500)
                interaction.followUp({
                    content: `<@${target.user.id}>`,
                    embeds: [muteembed]
                })
                let unmuteEmbed = new MessageEmbed()
                    .setColor("#43B581")
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`<:greencheck:900148615677358090> Un usuario ha sido automáticamente desmuteado.`)
                    .addField("**• Usuario**", `${target.user.tag}`)
                    .addField("**• Duración del mute**", `\`${traducidoTime}\``)
                    .addField("**• Razón del mute**", `\`${reason}\``)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                setTimeout(() => { target.roles.add(muteRole)}, 500)


                setTimeout(() => {
                    if (!target.roles.cache.has(muteRole.id)) {
                        console.log('bot tried to unmute but user was unmuted')
                        return
                    }
                    target.roles.remove(muteRole);
                

                    client.channels.cache.get(client.config.logchannel).send({ embeds: [unmuteEmbed] })
                }, ms(time))
            } catch (error) {
                console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                let somethingtime = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redwarn:903008123550335046> Tiempo - Comando /mute**")
                    .addField('Formato', '• El parámetro \`tiempo\` usa el paquete "ms". Los valores permitidos están aquí abajo.')
                    .addField(`Segundos`, '**/mute <usuario> (razón) 30s**\n• Mutea al usuario por 30 segundos.', true)
                    .addField(`Minutos`, '**/mute <usuario> (razón) 15m**\n• Mutea al usuario por 15 minutos.', true)
                    .addField(`Horas`, '**/mute <usuario> (razón) 12h**\n• Mutea al usuario por 12 horas.', true)
                    .addField(`Días`, '**/mute <usuario> (razón) 3d**\n• Mutea al usuario por 3 días.', true)


                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                interaction.followUp({
                    embeds: [somethingtime]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /mute\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 10000)
                    })
            }
        }
    }
}
