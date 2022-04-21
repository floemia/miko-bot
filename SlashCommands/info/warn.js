const { MessageEmbed } = require('discord.js')
const warnModel = require('../../models/warnModel')
module.exports = {
    name: "warn",
    description: "Warnea al usuario especificado.",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: 'usuario',
            description: 'Usuario a warnear.',
            type: 'USER',
            required: true,
        },
        {
            name: 'razon',
            description: 'Razón/Motivo para warnear al usuario.',
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
        const guild = client.guilds.cache.get(client.config.guild);
        const target = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('razon') || "No se especificó una razón.";
try{
    let banPermErr = new MessageEmbed()
    .setColor('RED')
    .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
    .setDescription("• Sólo sigo las órdenes de los mods.")
    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
    .setTimestamp()

let banModErr = new MessageEmbed()
    .setColor('RED')
    .setTitle("**<:redx:900360448292040775> ¿Qué estás haciendo?**")
    .setDescription("• No tengo permiso para warnear a un mod.")
    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
    .setTimestamp()

let yourself = new MessageEmbed()
    .setColor('RED')
    .setTitle("**<:redx:900360448292040775> Te warneaste.**")
    .setDescription("• Espera. No puedes.")
    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
    .setTimestamp()

    let me = new MessageEmbed()
    .setColor('RED')
    .setTitle("**<:welldone:903316564487585832> ¿Por qué?.**")
    .setDescription("• Eres malo.")
    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
    .setTimestamp()
            

            if (target == interaction.member.user.id) {
                interaction.followUp({
                    embeds: [yourself]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /warn\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            
        if (target.user.id == '953705293345325146') {
            interaction.followUp({
                embeds: [me]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /warn\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }
        if (target.roles.highest.position >=
            interaction.member.roles.highest.position
        ) {
            interaction.followUp({ embeds: [banModErr] })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /warn\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }
    }

    
    catch(error){
        let Eror = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
            .setDescription(`${error}`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
        console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /warn\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`);
        interaction.followUp({
            embeds: [Eror]
        })                .then(msg => {
            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /warn\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
        })
    return
    }
        // new warnModel({
        //     guildid: interaction.guildId,
        //     user: target.id,
        //     moderatorId: interaction.member.id,
        //     reason,
        //     timestamp: Date.now()
        // }).save();

        // const warndata = await warnModel.findOne({ user: target.user.id })

        let banEmbed = new MessageEmbed()
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .setTitle(`**<:redwarn:903008123550335046> Un momento, ${target.user.tag}.**`)
        .setDescription('Compórtate. Es una advertencia.')
        .addField("**• Razón**", `\`${reason}\``)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()
        
        let bandm = new MessageEmbed()
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .setTitle(`**<:redwarn:903008123550335046> Has sido warneado/a en Miko Gang.**`)
        .setDescription('Más información abajo.')
        .addField("**• Razón**", `\`${reason}\``)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        let banLog = new MessageEmbed()
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .setTitle(`**<:redwarn:903008123550335046> Un usuario ha sido warneado.**`)
        .addField("**• Razón**", `\`${reason}\``)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        client.channels.cache.get(client.config.strikelogchannel).send({embeds: [banLog]})

        target.send({embeds: [bandm]}).catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /warn\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`))
        interaction.followUp({
            content: `<@${target.user.id}>`,
            embeds: [banEmbed]
        })
    }
}