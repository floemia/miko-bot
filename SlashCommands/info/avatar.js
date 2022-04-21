const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "avatar",
    description: "Consigue el avatar de un usuario.",
    options: [
        {
            name: 'usuario',
            description: 'Mostraré el avatar del usuario que menciones aquí.',
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
        const target = interaction.options.getMember('usuario');


        const embed = new MessageEmbed()
        .setTitle(`<:greencheck:900148615677358090> Este es el avatar de ${target.user.tag}.`)
        .setColor('#43B581')
        .setImage(target.user.displayAvatarURL({ size: 2048, dynamic: true }))
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            interaction.followUp({
                embeds: [embed]
            })
    }
}