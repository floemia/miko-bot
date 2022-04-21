const { Message, Client, MessageEmbed } = require("discord.js");
var participantes = new Array()
var premios = new Array()
module.exports = {
    name: "sorteo",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        var premios = [
            '1 mes de osu!support',
            '1 mes de Nitro Classic',
            'Cambio de nickname en osu!'
        ]
        var participantes =
        [
            "644265589367373837",
            "845365335825186868",
            "596481414426525696",
            "468198750377082880",
            "687841338783563787",
            "910657655691960330",
            "213091445467250688",
            "692823744019693668",
            "294163291394015234",
            "853869760588546068",
            "334170026636476417",
            "715672707060203540",
            "556246697013936150",
            "476106582975840267",
            "689985454288011267",
            "783425234232672296",
            "436182649468616705",
            "428707020665913364",
            "220648863126650881",
            "730986447229943838",
            "494218673976901635",
            "910693813306163241",
            "751978300909551616",
            "194305736749088768",
            "401646730161946627",
            "582971022387576845",
            "852650057672294430",
            "310897050071859200"
        ]
        if (message.author.id == "596481414426525696" || message.author.id == "235226691687940102") {
            message.delete()
            let embedSuspense = new MessageEmbed()
            .setColor('#43B581')
            .setTitle(`**<:greencheck:900148615677358090> Atentos.**`)
            .setDescription(`• Un sorteo está en proceso. el/la ganador/a y el premio serán revelados en 30 segundos.`)
            .setFooter(`Miko`, client.user.displayAvatarURL())
            .setTimestamp()

            message.channel.send({ embeds: [embedSuspense] })

            setTimeout(() => {
                indexPremio = Math.floor(Math.random() * premios.length)
                indexParticipante = Math.floor(Math.random() * participantes.length)
                let embedganador = new MessageEmbed()
                    .setColor('#43B581')
                    .setTitle(`**<:greencheck:900148615677358090> Y terminó.**`)
                    .setDescription(`• ¡Felicidades, <@${participantes[indexParticipante]}>, ganaste!`)
                    .addField("**• Premio**", `${premios[indexPremio]}`)
                    .setFooter(`Miko`, client.user.displayAvatarURL())
                    .setTimestamp()
                message.channel.send({ content: `<@${participantes[indexParticipante]}>`, embeds: [embedganador] })
                console.log(participantes)
                return
            }, 30000)
        }
    }
}