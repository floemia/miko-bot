const { MessageEmbed } = require('discord.js')
const { CommandInteractionOptionResolver, Permissions } = require("discord.js");
module.exports = {
    name: "ban",
    description: "Banea al usuario especificado.",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: 'usuario',
            description: 'Usuario a banear.',
            type: 'USER',
            required: true,
        },
        {
            name: 'razon',
            description: 'Razón/motivo para banear a este usuario.',
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
        const permissions = [
            {
                id: '464464090157416448',
                type: 'ROLE',
                permission: false,
            },
        ];
        const command = client.slashCommands.get(interaction.commandName);
        await command.permissions.add({ permissions });
        
        client.config = require("../../config.json");
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
            .setDescription("• No tengo permiso para banear a un mod.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

        let yourself = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Te baneaste.**")
            .setDescription("• Espera. No puedes.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            let me = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:welldone:903316564487585832> ¿Quieres deshacerte de mí?.**")
            .setDescription("• Eres malo.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
            

            if (target == interaction.member.user.id) {
                interaction.followUp({
                    embeds: [yourself]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /ban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            
        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            interaction.followUp({
                embeds: [banPermErr]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /ban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
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
        if (target.roles.highest.position >=
            interaction.member.roles.highest.position
        ) {
            interaction.followUp({ embeds: [banModErr] })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /ban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }
    

}
    catch(error){
        let Eror = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Ocurrió un error al buscar el usuario.**")
            .setDescription("• Selecciona un usuario válido la próxima vez.")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
        console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /ban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`);
        interaction.followUp({
            embeds: [Eror]
        })                .then(msg => {
            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /ban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
        })
    return
    }
    
        let banEmbed = new MessageEmbed()
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .setTitle(`**<:redwarn:903008123550335046> Adiós, ${target.user.tag}.**`)
        .setDescription('Estás baneado/a. No te extrañaremos.')
        .addField("**• Razón**", `\`${reason}\``)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()
        
        let bandm = new MessageEmbed()
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .setTitle(`**<:redwarn:903008123550335046> Has sido baneado/a de Miko Gang.**`)
        .setDescription('Más información abajo.')
        .addField("**• Razón**", `\`${reason}\``)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        let banLog = new MessageEmbed()
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .setTitle(`**<:redwarn:903008123550335046> Un usuario ha sido baneado.**`)
        .addField("**• Usuario**", `${target.user.tag}`)
        .addField("**• Razón**", `\`${reason}\``)
        .addField("**• Baneado/a por**", `\`${interaction.member.user}\``)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()

        client.channels.cache.get(client.config.strikelogchannel).send({embeds: [banLog]})

        target.send({embeds: [bandm]}).catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /ban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`))
        setTimeout(() => { target.ban({ reason }).catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /ban\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`))}, 500)
        interaction.followUp({
            embeds: [banEmbed]
        })
    }
}