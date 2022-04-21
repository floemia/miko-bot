const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const discordTTS = require("discord-tts-spanish");
const { AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel, getVoiceConnection, voice } = require("@discordjs/voice");
let voiceConnection;
let firstChannel
var isConnected
var TimeoutCount
var timeoutDC
var voiceChatConn


let audioPlayer = new AudioPlayer();
module.exports = {
    name: "tts",
    description: "Si no tienes micrófono, diré algo por tí en el chat de voz.",
    options: [
        {
            name: 'decir',
            description: 'Si no tienes micrófono, diré algo por tí en el chat de voz.',
            type: 'SUB_COMMAND',
            options:
                [
                    {
                        name: 'texto',
                        description: 'El texto que quieres que diga.',
                        type: 'STRING',
                        required: true
                    }
                ],
        },
        {
            name: 'finalizar',
            type: 'SUB_COMMAND',
            description: 'Me desconectaré del canal de voz.'
        }
    ],
    /**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {String[]} args
 */

    run: async (client, interaction, args, message) => {
        const player = require("../../client/player.js")
        const queue = player.getQueue(interaction.guildId);
        client.config = require("../../config.json");
        const noMicroChannel = client.channels.cache.get(client.config.ttsChannel)
        const endConnectionTimeout = new Discord.MessageEmbed()
            .setColor('#dedede')
            .setDescription(`• Me desconecté automáticamente de <#${interaction.member.voice.channelId}>. Espero haber ayudado.`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
        const [subcommand] = args
        if (isConnected && interaction.member.voice.channelId != firstChannel) {
            let something = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                .setDescription(`• Ya estoy en un canal de voz.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

            interaction.followUp({
                embeds: [something]
            }).then(msg => {
                setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tts\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
            })
            return
        }
        if (subcommand == 'decir') {
            clearTimeout(timeoutDC)
            timeoutDC = setTimeout(() => {
                try{
                voiceConnection.disconnect()
                voiceConnection = ''
                noMicroChannel.send({
                    embeds: [endConnectionTimeout]
                })
                return
            }catch(error){
                console.log(error)
            return
            }
            }, 600000)
            if (!interaction.channel.name.includes("︙『🎤』no-micro")) {
                let noChannel = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> No puedes hacer eso aquí.**")
                    .setDescription(`• Debes ir al canal <#947994580408746025>.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                interaction.followUp({
                    embeds: [noChannel]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tts\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        return
                    })
                return
            }

            const texto = interaction.options.getString('texto')
            if (texto.length >= 200)
            {
                let something = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                .setDescription(`• El texto debe tener menos de 200 caracteres.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()
            interaction.followUp({
                embeds: [something]
            }).then(msg => {
                setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tts\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
            })
            return
            }
            if (!interaction.member.voice.channelId) {
                
                let something = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                    .setDescription(`• No estás en un canal de voz.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                interaction.followUp({
                    embeds: [something]
                }).then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tts\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
                return
            }
            console.log(texto)
            firstChannel = interaction.member.voice.channelId
            const stream = discordTTS.getVoiceStream(`${interaction.member.displayName} dice: ${texto}`);
            const audioResource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });

            if (!voiceConnection) {
                voiceConnection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                voiceConnection = await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
            
            }
            if (queue){
            queue.setPaused = true
        }
            if (voiceConnection.status === VoiceConnectionStatus.Connected) {
                voiceConnection.subscribe(audioPlayer);
                audioPlayer.play(audioResource)
                    if (queue){
                    queue.setPaused = false
                    }
                
                
            }
            const embed1 = new Discord.MessageEmbed()
                .setColor('#dedede')
                .setDescription(`• Dije \`${texto}\` en <#${interaction.member.voice.channelId}>.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

            interaction.followUp({
                embeds: [embed1]
            })
            isConnected = true
        }

        if (subcommand == 'finalizar') {
            if (!interaction.channel.name.includes("︙『🎤』no-micro")) {
                let noChannel = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> No puedes hacer eso aquí.**")
                    .setDescription(`• Debes ir al canal <#947994580408746025>.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                interaction.followUp({
                    embeds: [noChannel]
                })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tts\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        return
                    })
                return
            }
            if (!isConnected) {
                let something = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                    .setDescription(`• No estoy en un canal de voz.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                interaction.followUp({
                    embeds: [something]
                }).then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tts\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
                return
            }
            if (isConnected && interaction.member.voice.channelId != firstChannel) {
                let notSameChannel = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                    .setDescription(`• Debes estar en <#${firstChannel}> para hacer eso.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                interaction.followUp({
                    embeds: [notSameChannel]
                }).then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tts\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
                return
            }
            clearTimeout(timeoutDC)
            
            const endConnection = new Discord.MessageEmbed()
                .setColor('#dedede')
                .setDescription(`• Me desconecté de <#${interaction.member.voice.channelId}>. Espero haber ayudado.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

            interaction.followUp({
                embeds: [endConnection]
            })
            isConnected = false
            voiceConnection.disconnect()
            voiceConnection = ''
        }
    }
}