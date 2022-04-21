const { Discord, MessageEmbed, MessageButton, MessageActionRow, CommandInteractionOptionResolver } = require('discord.js')
const nodeosu = require('node-osu')
const { timeSince, getShortMods, getRank } = require('../../utils.js');
const config = require('../../config.json')
const { v2, auth } = require('osu-api-extended')
const { v1 } = require('osu-api-extended')
v1.set_key(config.osuApiKey)
const osu = new nodeosu.Api(config.osuApiKey, { // Set your API Key in config.json
    notFoundAsError: true,
    completeScores: true,
    parseNumeric: true,
})
const curl = require('curl')
const { modbits, parser, diff, ppv2 } = require('ojsama');
const accModel = require('../../models/accModel')
const emo_config = require('../../emoji_config.json')
module.exports = {
    name: "osu",
    description: "Comando de prueba (por ahora: perfil de osu!mania)",
    options: [
        {
            name: "perfil",
            type: 'SUB_COMMAND',
            description: 'Mira el perfil de osu!Bancho de alguien.',
            options: [
                {
                    name: 'nickname',
                    type: 'STRING',
                    description: 'Nickname del perfil que quieres ver. También puedes mencionar a un usuario.'
                }
            ],
        },
        {

            name: "vincular",
            type: 'SUB_COMMAND',
            description: 'Vincula tu cuenta de osu!Bancho.',
            options: [
                {
                    name: 'nickname',
                    type: 'STRING',
                    description: 'Nickname de tu cuenta.',
                    required: true
                }


            ]
        },
        {

            name: "reciente",
            type: 'SUB_COMMAND',
            userPermissions: ["ADMINISTRATOR"],
            description: 'Muestra la play más reciente de osu!Bancho de alguien.',
            options: [
                {
                    name: 'nickname',
                    type: 'STRING',
                    description: 'Nickname de tu cuenta. También puedes mencionar a un usuario.',
                    required: false,
                },
                {
                    name: 'modo',
                    type: 'STRING',
                    description: 'Modo de juego de la play.',
                    choices: [
                        {
                            name: 'osu!',
                            value: '0',
                        },
                        {
                            name: 'osu!taiko',
                            value: '1'
                        },
                        {
                            name: 'osu!catch',
                            value: '2'
                        },
                        {
                            name: 'osu!mania',
                            value: '3'
                        },
                    ]
                },
                {
                    name: 'pass',
                    type: 'STRING',
                    description: 'Decide si sólo mostrar passes.',
                    choices: [
                        {
                            name: 'sí',
                            value: '1',
                        },
                        {
                            name: 'no',
                            value: '0'
                        },
                    ]
                }
            ]
        }
    ],

    run: async (client, interaction, args) => {
        const osuapiv2 = await auth.login(config.clientId, config.clientSecret)
        const intuser = interaction.user.id
        const [message] = args
        const [subcommand] = args
        if (subcommand == 'perfil') {
            {

                const idOsu = Math.floor(Math.random() * (100000 - 50000)) + 50000;
                const idTaiko = Math.floor(Math.random() * (150000 - 110000)) + 110000;
                const idMania = Math.floor(Math.random() * (200000 - 160000)) + 160000;
                const idCtb = Math.floor(Math.random() * (250000 - 210000)) + 210000;

                const rowOsu = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("955183369954680922")
                            .setStyle("SECONDARY")
                            .setCustomId("osuDisabled")
                            .setDisabled('true'),

                        new MessageButton()
                            .setEmoji('955183369740775504')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idCtb}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369816256523')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idMania}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369912721428')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idTaiko}`)
                            .setDisabled('false'),
                    )
                const rowCtb = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("955183369954680922")
                            .setStyle("SECONDARY")
                            .setCustomId(`${idOsu}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369740775504')
                            .setStyle("SECONDARY")
                            .setCustomId("osuCTBDisabled")
                            .setDisabled('true'),

                        new MessageButton()
                            .setEmoji('955183369816256523')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idMania}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369912721428')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idTaiko}`)
                            .setDisabled('false'),
                    )

                const rowMania = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("955183369954680922")
                            .setStyle("SECONDARY")
                            .setCustomId(`${idOsu}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369740775504')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idCtb}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369816256523')
                            .setStyle("SECONDARY")
                            .setCustomId("osuManiaDisabled")
                            .setDisabled('true'),

                        new MessageButton()
                            .setEmoji('955183369912721428')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idTaiko}`)
                            .setDisabled('false'),
                    )
                const rowTaiko = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("955183369954680922")
                            .setStyle("SECONDARY")
                            .setCustomId(`${idOsu}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369740775504')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idCtb}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369816256523')
                            .setStyle("SECONDARY")
                            .setCustomId(`${idMania}`)
                            .setDisabled('false'),

                        new MessageButton()
                            .setEmoji('955183369912721428')
                            .setStyle("SECONDARY")
                            .setCustomId("osuTaikoDisabled")
                            .setDisabled('true'),
                    )

                const rowOver = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("955183369954680922")
                            .setStyle("SECONDARY")
                            .setCustomId("osuDisabled")
                            .setDisabled('true'),

                        new MessageButton()
                            .setEmoji('955183369740775504')
                            .setStyle("SECONDARY")
                            .setCustomId("osuCTBDisabled")
                            .setDisabled('true'),

                        new MessageButton()
                            .setEmoji('955183369816256523')
                            .setStyle("SECONDARY")
                            .setCustomId("osuManiaDisabled")
                            .setDisabled('true'),

                        new MessageButton()
                            .setEmoji('955183369912721428')
                            .setStyle("SECONDARY")
                            .setCustomId("osuTaikoDisabled")
                            .setDisabled('true'),
                    )


                var user
                const userid = await accModel.findOne({ osuAccOwner: interaction.member.user.id })
                try {
                    if (!interaction.options.getString('nickname') && userid.osuAccOwner == interaction.member.user.id) {
                        user = userid.osuAccName
                    }
                } catch (error) {
                    let something = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                        .setDescription(`• No tienes una cuenta vinculada y tampoco has especificado una en \`nickname\`. Puedes vincular tu cuenta con \`/osu vincular <nickname>\`.`)
                        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                        .setTimestamp()
                    interaction.followUp({
                        embeds: [something]
                    })
                        .then(msg => {
                            setTimeout(() => msg.delete().catch(error => console.log(`\\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        })
                    return
                }

                if (interaction.options.getString('nickname')) {
                    var userM = interaction.options.getString('nickname')
                    var userN = userM.replace("<@!", "")
                    var DBuser = userN.replace(/>/g, '');
                    try {
                        dbFetch = await accModel.findOne({ osuAccOwner: DBuser })
                        user = dbFetch.osuAccName
                    } catch (error) {
                        user = interaction.options.getString('nickname')
                    }
                }


                try {
                    async function fetchMode(mode) {
                        var au
                        var data
                        try {
                            au = await osu.getUser({ u: user, m: mode })
                            var osuId = au.id
                            var num = osuId.replace(/\D/g, '');
                            data = await v2.user.get(num, "mania");
                        } catch (error) {
                            let something = new MessageEmbed()
                                .setColor('RED')
                                .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                                .setDescription(`• Este usuario no existe.`)
                                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                                .setTimestamp()
                            interaction.followUp({
                                embeds: [something]
                            })
                                .then(msg => {
                                    setTimeout(() => msg.delete().catch(error => console.log(`\\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                                })
                            return

                        }
                        var uname = au.name
                        const flagnam = au.country.toUpperCase()
                        var playcount
                        var pp1
                        var totalpp
                        var rank
                        var countryrank
                        var Xranks
                        var XHranks
                        var Sranks
                        var SHranks
                        var acc
                        var timeElapsed
                        var connection
                        var timeString
                        var Aranks

                        if (!au.counts.plays) {

                            playcount = "0"
                        }
                        else {
                            acc = Math.round(au.accuracy * 100) / 100 + '%'
                            playcount = au.counts.plays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }

                        if (!au.pp.rank) {
                            rank = ` -`
                            acc = " -"
                            totalpp = " -"
                            countryrank = ` -`
                        }
                        else {
                            pp1 = au.pp.raw.toString().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            totalpp = pp1.toString().replace(".", ",")
                            rank = au.pp.rank.toString().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            countryrank = au.pp.countryRank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }

                        if (!au.counts.SS) {
                            Xranks = "0"
                        }
                        else {
                            Xranks = au.counts.SS.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }

                        if (!au.counts.SSH) {
                            XHranks = "0"
                        }
                        else {
                            XHranks = au.counts.SSH.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }

                        if (!au.counts.S) {
                            Sranks = "0"
                        }
                        else {
                            Sranks = au.counts.S.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }

                        if (!au.counts.SH) {
                            SHranks = "0"
                        }
                        else {
                            SHranks = au.counts.SH.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }

                        if (!au.counts.A) {
                            Aranks = "0"
                        }
                        else {
                            Aranks = au.counts.A.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                        const url = 'http://s.ppy.sh/a/'
                        if (mode == 0) {
                            const embedOsu = new MessageEmbed()
                                .setColor('#DEDEDE')
                                .setAuthor(`Perfil de osu! de ${[uname]}`, `http://osu.ppy.sh/images/flags/${flagnam}.png`, `http://osu.ppy.sh/users/${au.id}`)
                                .setThumbnail(`http://s.ppy.sh/a/${au.id}`, ({ size: 2048 }))
                                .setDescription(`**• Rank:** #${rank} (${au.country} #${countryrank})\r\n**• Nivel:** ${Math.round(au.level * 100) / 100}\r\n**• PP Total:** ${totalpp}\r\n**• Precisión:** ${acc}\r\n**• Playcount:** ${playcount}\r`)
                                .addField('• Conteo de ranks:', `${emo_config.SSH} \`${XHranks}\` • ${emo_config.SS}  \`${Xranks}\` • ${emo_config.SH}  \`${SHranks}\` • ${emo_config.S}  \`${Sranks}\` • ${emo_config.A}  \`${Aranks}\``, true)
                            if (data.is_online) {
                                embedOsu.setFooter('Online ahora', 'https://i.ibb.co/qD4sKdp/online.png')
                            } else {
                                timeString = new Date(data.last_visit);
                                timeString = timeString.getTime()
                                console.log(timeString)
                                timeElapsed = timeSince(timeString)
                                console.log(timeElapsed)
                                timeElapsed = timeElapsed.replace('H', 'h')
                                embedOsu.setFooter(`Offline ${timeElapsed}`, 'https://i.ibb.co/Y0RdDzb/offline.png')

                            }

                            return embedOsu
                        }

                        if (mode == 2) {
                            const embedCtb = new MessageEmbed()
                                .setColor('#DEDEDE')
                                .setAuthor(`Perfil de osu!catch de ${[uname]}`, `http://osu.ppy.sh/images/flags/${flagnam}.png`, `http://osu.ppy.sh/users/${au.id}/fruits`)
                                .setURL(`http://osu.ppy.sh/users/${au.id}/mania`)
                                .setThumbnail(`http://s.ppy.sh/a/${au.id}`, ({ size: 2048 }))
                                .setDescription(`**• Rank:** #${rank} (${au.country} #${countryrank})\r\n**• Nivel:** ${Math.round(au.level * 100) / 100}\r\n**• PP Total:** ${totalpp}\r\n**• Precisión:** ${acc}\r\n**• Playcount:** ${playcount}\r`)
                                .addField('• Conteo de ranks:', `${emo_config.SSH} \`${XHranks}\` • ${emo_config.SS}  \`${Xranks}\` • ${emo_config.SH}  \`${SHranks}\` • ${emo_config.S}  \`${Sranks}\` • ${emo_config.A}  \`${Aranks}\``, true)
                            if (data.is_online) {
                                embedCtb.setFooter('Online ahora', 'https://i.ibb.co/qD4sKdp/online.png')
                            } else {
                                timeString = new Date(data.last_visit);
                                timeString = timeString.getTime()
                                console.log(timeString)
                                timeElapsed = timeSince(timeString)
                                console.log(timeElapsed)
                                timeElapsed = timeElapsed.replace('H', 'h')
                                embedCtb.setFooter(`Offline ${timeElapsed}`, 'https://i.ibb.co/Y0RdDzb/offline.png')

                            }
                            return embedCtb
                        }
                        if (mode == 3) {
                            const embedMania = new MessageEmbed()
                                .setColor('#DEDEDE')
                                .setAuthor(`Perfil de osu!mania de ${[uname]}`, `http://osu.ppy.sh/images/flags/${flagnam}.png`, `http://osu.ppy.sh/users/${au.id}/mania`)
                                .setThumbnail(`http://s.ppy.sh/a/${au.id}`, ({ size: 2048 }))
                                .setDescription(`**• Rank:** #${rank} (${au.country} #${countryrank})\r\n**• Nivel:** ${Math.round(au.level * 100) / 100}\r\n**• PP Total:** ${totalpp}\r\n**• Precisión:** ${acc}\r\n**• Playcount:** ${playcount}\r`)
                                .addField('• Conteo de ranks:', `${emo_config.SSH} \`${XHranks}\` • ${emo_config.SS}  \`${Xranks}\` • ${emo_config.SH}  \`${SHranks}\` • ${emo_config.S}  \`${Sranks}\` • ${emo_config.A}  \`${Aranks}\``, true)
                            if (data.is_online) {
                                embedMania.setFooter('Online ahora', 'https://i.ibb.co/qD4sKdp/online.png')
                            } else {
                                timeString = new Date(data.last_visit);
                                timeString = timeString.getTime()
                                console.log(timeString)
                                timeElapsed = timeSince(timeString)
                                console.log(timeElapsed)
                                timeElapsed = timeElapsed.replace('H', 'h')
                                embedMania.setFooter(`Offline ${timeElapsed}`, 'https://i.ibb.co/Y0RdDzb/offline.png')

                            }
                            return embedMania
                        }
                        if (mode == 1) {
                            const embedTaiko = new MessageEmbed()
                                .setColor('#DEDEDE')
                                .setAuthor(`Perfil de osu!taiko de ${[uname]}`, `http://osu.ppy.sh/images/flags/${flagnam}.png`, `http://osu.ppy.sh/users/${au.id}/taiko`)
                                .setThumbnail(`http://s.ppy.sh/a/${au.id}`, ({ size: 2048 }))
                                .setDescription(`**• Rank:** #${rank} (${au.country} #${countryrank})\r\n**• Nivel:** ${Math.round(au.level * 100) / 100}\r\n**• PP Total:** ${totalpp}\r\n**• Precisión:** ${acc}\r\n**• Playcount:** ${playcount}\r`)
                                .addField('• Conteo de ranks:', `${emo_config.SSH} \`${XHranks}\` • ${emo_config.SS}  \`${Xranks}\` • ${emo_config.SH}  \`${SHranks}\` • ${emo_config.S}  \`${Sranks}\` • ${emo_config.A}  \`${Aranks}\``, true)
                            if (data.is_online) {
                                embedTaiko.setFooter('Online ahora', 'https://i.ibb.co/qD4sKdp/online.png')
                            } else {
                                timeString = new Date(data.last_visit);
                                timeString = timeString.getTime()
                                console.log(timeString)
                                timeElapsed = timeSince(timeString)
                                console.log(timeElapsed)
                                timeElapsed = timeElapsed.replace('H', 'h')
                                embedTaiko.setFooter(`Offline ${timeElapsed}`, 'https://i.ibb.co/Y0RdDzb/offline.png')

                            }
                            return embedTaiko
                        }

                    }
                    //    const embedplswait = new MessageEmbed()
                    //     .setColor('#DEDEDE')
                    //     .setTitle(`**<:graycheck:903741976061567027> Un momento.**`)
                    //     .setDescription(`• Estoy obteniendo información de la osu!api.`)
                    //     .setFooter(`Miko`, client.user.displayAvatarURL())
                    // const sentMessage = interaction.followUp({ embeds: [embedplswait] })
                    // .addField('• Conteo de hits:', `${emo_config.hit50}  \`${au.counts['50']}\`${emo_config.hit100}  \`${au.counts['100']}\`\n${emo_config.hit300} \`${au.counts['300']}\``, true)


                    fetchMode(0).then((embedOsu) => {
                        const sentMessage = interaction.followUp({
                            embeds: [embedOsu], components: [rowOsu]
                        })
                    })

                    setTimeout(() => {
                        collector.on('end', async => {
                        });
                    }, 61000)

                    const filter = i => i.user.id === intuser;

                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 61000 });


                    collector.on('collect', async i => {

                        if (i.customId === `${idOsu}`) {

                            fetchMode(0).then((embedOsu) => {
                                i.update({ embeds: [embedOsu], components: [rowOsu] });
                            })


                        }

                        if (i.customId === `${idCtb}`) {

                            fetchMode(2).then((embedCtb) => {
                                i.update({ embeds: [embedCtb], components: [rowCtb] });
                            })
                        }

                        if (i.customId === `${idMania}`) {

                            fetchMode(3).then((embedMania) => {
                                i.update({ embeds: [embedMania], components: [rowMania] });
                            })
                        }

                        if (i.customId === `${idTaiko}`) {

                            fetchMode(1).then((embedTaiko) => {
                                i.update({ embeds: [embedTaiko], components: [rowTaiko] });
                            })
                        }

                        setTimeout(() => {
                            i.editReply({
                                components: [rowOver]
                            })
                        }, 60000)

                    })
                } catch (error) {
                    let something = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                        .setDescription(`${error}`)
                        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                        .setTimestamp()
                    interaction.followUp({
                        embeds: [something]
                    })
                        .then(msg => {
                            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        })
                    return
                }
            }
        }
        if (subcommand == 'vincular') {
            const user = interaction.options.getString('nickname')
            try {
                const au = await osu.getUser({ u: user, m: 0 })
                var uname = au.name
                const flagnam = au.country.toUpperCase()
                var playcount
                var pp1
                var totalpp
                var rank
                var countryrank
                var Xranks
                var XHranks
                var Sranks
                var SHranks
                var acc
                var Aranks
                if (!au.counts.plays) {
                    acc = "-"
                    playcount = "0"
                }
                else {
                    acc = Math.round(au.accuracy * 100) / 100 + '%'
                    playcount = au.counts.plays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }

                if (!au.pp.rank) {
                    rank = ` -`
                    acc = " -"
                    totalpp = " -"
                    countryrank = ` -`
                }
                else {
                    pp1 = au.pp.raw.toString().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    totalpp = pp1.toString().replace(".", ",")
                    rank = au.pp.rank.toString().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    countryrank = au.pp.countryRank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }

                if (!au.counts.SS) {
                    Xranks = "0"
                }
                else {
                    Xranks = au.counts.SS.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }

                if (!au.counts.SSH) {
                    XHranks = "0"
                }
                else {
                    XHranks = au.counts.SSH.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }

                if (!au.counts.S) {
                    Sranks = "0"
                }
                else {
                    Sranks = au.counts.S.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }

                if (!au.counts.SH) {
                    SHranks = "0"
                }
                else {
                    SHranks = au.counts.SH.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }

                if (!au.counts.A) {
                    Aranks = "0"
                }
                else {
                    Aranks = au.counts.A.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                const url = 'http://s.ppy.sh/a/'
                const proceedID = Math.floor(Math.random() * (100000 - 1)) + 1;
                const desistID = Math.floor(Math.random() * (200000 - 100001)) + 100001;
                const rowconfirm = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("912454354911498282")
                            .setStyle("SUCCESS")
                            .setCustomId(`${proceedID}`),

                        new MessageButton()
                            .setEmoji('900142062568079460')
                            .setStyle("DANGER")
                            .setCustomId(`${desistID}`)
                    )
                const rowover2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("912454354911498282")
                            .setStyle("SUCCESS")
                            .setCustomId("proceeddisabled")
                            .setDisabled("true"),

                        new MessageButton()
                            .setEmoji('900142062568079460')
                            .setStyle("DANGER")
                            .setCustomId("desistdisabled")
                            .setDisabled("true")
                    )
                var sentMessage
                try {
                    const userid = await accModel.findOne({ osuAccOwner: interaction.member.user.id })
                    const overwrite = new MessageEmbed()
                        .setColor('#DEDEDE')
                        .setAuthor(`Perfil de osu! de ${[uname]}`, `http://osu.ppy.sh/images/flags/${flagnam}.png`, `http://osu.ppy.sh/users/${au.id}`)
                        .setThumbnail(`http://s.ppy.sh/a/${au.id}`, ({ size: 2048 }))
                        .setDescription(`**• Rank:** #${rank} (${au.country} #${countryrank})\r\n**• Nivel:** ${Math.round(au.level * 100) / 100}\r\n**• PP Total:** ${totalpp}\r\n**• Precisión:** ${acc}\r`)
                        .addField(`**• Advertencia**`, `Ya tienes una cuenta vinculada (\`${userid.osuAccName}\`). Si aceptas, \`${uname}\` será tu nueva cuenta vinculada.`)
                        .setFooter(`Miko`, client.user.displayAvatarURL())
                    try {
                        if (userid.osuAccOwner == interaction.member.user.id) {
                            sentMessage = await interaction.followUp({ content: `¿Es esta tu cuenta?`, embeds: [overwrite], components: [rowconfirm] })
                        }
                    } catch {


                        const embedOsu = new MessageEmbed()
                            .setColor('#DEDEDE')
                            .setAuthor(`Perfil de osu! de ${[uname]}`, `http://osu.ppy.sh/images/flags/${flagnam}.png`, `http://osu.ppy.sh/users/${au.id}`)
                            .setThumbnail(`http://s.ppy.sh/a/${au.id}`, ({ size: 2048 }))
                            .setDescription(`**• Rank:** #${rank} (${au.country} #${countryrank})\r\n**• Nivel:** ${Math.round(au.level * 100) / 100}\r\n**• PP Total:** ${totalpp}\r\n**• Precisión:** ${acc}\r`)
                            .setFooter(`Miko`, client.user.displayAvatarURL())

                        sentMessage = await interaction.followUp({ content: `¿Es esta tu cuenta?`, embeds: [embedOsu], components: [rowconfirm] })
                    }
                    const filter = i => i.user.id === intuser;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
                    collector.on('collect', async i => {

                        if (i.customId === `${proceedID}`) {
                            const vinculacion = new MessageEmbed()
                                .setColor('#43B581')
                                .setThumbnail(`http://s.ppy.sh/a/${au.id}`, ({ size: 2048 }))
                                .setTitle(`**<:greencheck:900148615677358090> Tu cuenta se ha vinculado a "${uname}".**`)
                                .setDescription(`• Ahora no es necesario que escribas tu nickname cuando hagas los comandos.`)
                                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                                .setTimestamp()
                            try {
                                const userid = await accModel.findOne({ osuAccOwner: interaction.member.user.id })
                                userid.delete()
                                new accModel({
                                    osuAccName: user,
                                    osuAccOwner: interaction.member.user.id
                                }).save()
                                sentMessage.edit({ content: "Hecho!", embeds: [vinculacion], components: [] });
                                clearTimeout(time)
                                return
                            } catch {
                                new accModel({
                                    osuAccName: user,
                                    osuAccOwner: interaction.member.user.id
                                }).save()
                                sentMessage.edit({ content: "Hecho!", embeds: [vinculacion], components: [] });
                                clearTimeout(time)
                                return
                            }
                        }

                        if (i.customId === `${desistID}`) {
                            sentMessage.delete()
                            clearTimeout(time)
                            return
                        }

                    })
                    time = setTimeout(() => {

                        collector.on('end', collected => console.log('finish'));

                        sentMessage.edit({ components: [rowover2] }).catch(error => {
                            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                        })
                        setTimeout(() => {
                            sentMessage.delete().catch(error => {
                                console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                            })
                        }, 2000)
                    }, 10000)

                } catch (error) {
                    let something = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                        .setDescription(`${error}`)
                        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                        .setTimestamp()
                    interaction.followUp({
                        embeds: [something]
                    })
                        .then(msg => {
                            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        })
                    return

                }
            } catch (error) {
                let something = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                    .setDescription(`${error}`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                interaction.followUp({
                    embeds: [something]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }


        }
        if (subcommand == "reciente") {
            var user
            const userid = await accModel.findOne({ osuAccOwner: interaction.member.user.id })
            try {
                if (!interaction.options.getString('nickname') && userid.osuAccOwner == interaction.member.user.id) {
                    user = userid.osuAccName
                }
            } catch (error) {
                let something = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                    .setDescription(`• No tienes una cuenta vinculada y tampoco has especificado una en \`nickname\`. Puedes vincular tu cuenta con \`/osu vincular <nickname>\`.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                interaction.followUp({
                    embeds: [something]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            var modo
            var showPassed
            var passOnly
            // if (!interaction.options.getString('modo') && userid.osuAccOwner == interaction.member.user.id) {
            //     modo = userid.osuAccMode
            // } else {
                
            modo = interaction.options.getString('modo')
            showPassed = interaction.options.getString('pass')
            // }
            if (interaction.options.getString('nickname')) {
                var userM = interaction.options.getString('nickname')
                var userN = userM.replace("<@!", "")
                var DBuser = userN.replace(/>/g, '');
                try {
                    dbFetch = await accModel.findOne({ osuAccOwner: DBuser })
                    user = dbFetch.osuAccName
                } catch (error) {
                    user = interaction.options.getString('nickname')
                }
            }

            var gamemode
            var mode
            var modev1
            if (showPassed = 'no' || !showPassed)
            {
                passOnly = '1'
            }
            if (showPassed = 'sí'){
                passOnly = '0'
            }

            if (modo == '0') {
                mode = 'osu'
                modev1 = '0'
                gamemode = 'osu!'
            }
            if (modo == '1') {
                mode = 'taiko'
                modev1 = '1'
                gamemode = 'osu!taiko'
            }
            if (modo == '2') {
                mode = 'fruits'
                modev1 = '2'
                gamemode = 'osu!catch'
            }
            if (modo == '3') {
                mode = 'mania'
                modev1 = '3'
                gamemode = 'osu!mania'
            }
            console.log(`modo : ${mode} ; gamemode : ${gamemode}`)
            var recentData
            var userIdCheck
            try{
            userIdcheck = await osu.getUser({ u: user, m: modev1 })
            var osuId = userIdcheck.id
            var num = osuId.replace(/\D/g, '');
            recentData = await v2.scores.users.recent(num, {mode: mode, include_fails: passOnly}).then(async r => {

                // console.log(r[0])
                const recent = r[0]; 
                const beatmapRec = await v2.beatmap.get(recent.beatmap.id)
            

                let acc = recent.accuracy;
                acc = acc.toFixed(4);
                if (acc < 100) {
                    acc *= 100;
                }
                acc = parseFloat(acc.toFixed(2));
                var timeRecent = new Date(recent.created_at)
                const rDate = timeSince(timeRecent.getTime());
                console.log(timeRecent, rDate)
                const score = recent.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                var shortMods = getShortMods(recent.mods);
                const rank = getRank(recent.rank);
                if (modev1 == '0') {
                    const stdPPcalc = require('../../ppcalc/std/std-pp.js')
                    stdPPcalc.calculate(interaction, recent, score, rank, gamemode, rDate, shortMods, userIdcheck, beatmapRec)

                }
                if (modev1 == '1' || modev1 == '2' || modev1 == '3') {
                    var shortModsCalc

                    if (mode == '3') {
                        if (shortMods.includes('NC')) {
                            shortMods = shortMods.replace("DT", "")
                        }
                        shortModsCalc = shortMods.replace(/HR|FL|SD|HD|FI|FL|MR|PF|Mirror|/g, '');
                        console.log(`después: ${shortModsCalc}`)
                        const maniaPPcalc = require('../../ppcalc/mania/osu!mania-pp');
                        const rank = getRank(recent.rank)
                        let scoreData = {
                            beatmapId: recent.beatmapId,
                            overallDifficulty: recent.beatmap.difficulty.overall,
                            keys: recent.beatmap.difficulty.size,
                            score: recent.score,
                            objects: recent.beatmap.objects.normal + recent.beatmap.objects.slider,
                            starRating: recent.beatmap.difficulty.rating,
                            mods: shortModsCalc,
                        };
                        let ppCalc
                        ppCalc = maniaPPcalc.calculate(scoreData, interaction, recent, score, rank, gamemode, recentUser, rDate, shortMods)

                        // let scoreDataSS = { 
                        //     beatmapId: recent.beatmapId,
                        //     starRating: recent.beatmap.difficulty.rating,
                        //     mods: 'none', 
                        //     accuracy: 100
                        // };


                        // ppCalcFull = maniaPPcalc.calculate(scoreDataSS)
                    }
                }
            })
        }catch(error){
            let something = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
            .setDescription(`• Este usuario no tiene una play reciente.`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
            interaction.followUp({
                embeds: [something]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\\nAN ERROR HAS OCURRED.\nCOMMAND: /osu\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }
        }
    }
}