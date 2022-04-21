const { QueryType } = require("discord-player");
const axios = require("axios");
const player = require("../../client/player.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
var canal
var participantes = new Array()
var skip
var isEmpty
var sentMessage
var manualDisconnect
var guild
player.on("trackStart", (queue, track) => {
    if (sentMessage) {
        console.log('truck')
        return
    }
    let embedtrackAuto = new MessageEmbed()
        .setColor('#43B581')
        .setTitle(`**<:greencheck:900148615677358090> Ahora comienza:**`)
        .setDescription(`• **🎶 | [${track.title}](${track.url})**`)
        .setThumbnail(track.thumbnail)
        .setFooter(`Pedido por ${track.requestedBy.tag}`, track.requestedBy.displayAvatarURL())
        .setTimestamp()
    canal.send({ embeds: [embedtrackAuto] });
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    
});

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    queue.destroy()
});

player.on("botDisconnect", (queue) => {
    if (sentMessage) {
        console.log('truck')
        return
    }
    canal.send({ embeds: [manualDisconnect] });

});

player.on("channelEmpty", (queue) => {
    const channelEmptyEmbed = new MessageEmbed()
    .setColor('#dedede')
    .setDescription(`• El canal de voz está vacío. \`Eliminando cola de músicas y saliendo...\``)
    .setFooter(`Miko`, guild.me.user.displayAvatarURL())
    .setTimestamp()
    canal.send({ embeds: [channelEmptyEmbed] });
});
    isEmpty = true

player.on("queueEnd", (queue) => {
    if (isEmpty){
        return
    }
    const queueEndEmbed = new MessageEmbed()
    .setColor('#dedede')
    .setDescription(`• La cola de músicas terminó. \`Saliendo del canal...\``)
    .setFooter(`Miko`, guild.me.user.displayAvatarURL())
    .setTimestamp()
    canal.send({ embeds: [queueEndEmbed] });
    setTimeout(() =>{
        isEmpty = false
    }, 5000)
});
module.exports = {
    name: "musica",
    description: "musica comandos",
    options: [
        {
            name: 'escuchar',
            description: 'Reproduciré una música en el chat de voz.',
            type: 'SUB_COMMAND',
            options:
                [
                    {
                        name: 'titulo',
                        description: 'El título de la música que quieres escuchar.',
                        type: 'STRING',
                        required: true
                    }
                ],
        },
        {
            name: 'volumen',
            type: 'SUB_COMMAND',
            description: 'Modificaré el volumen al que quieres escuchar la música.',
            options:
                [
                    {
                        name: 'porcentaje',
                        description: 'El porcentaje de volumen.',
                        type: 'INTEGER',
                        required: false
                    }
                ],
        },

        {
            name: 'titulo',
            type: 'SUB_COMMAND',
            description: 'Mostraré el nombre de la música que estoy reproduciendo.'
        },
        {
            name: 'pausar',
            type: 'SUB_COMMAND',
            description: 'Pausaré la música.'
        },
        {
            name: 'cola',
            type: 'SUB_COMMAND',
            description: 'Mostraré la cola de reproducción.'
        },
        {
            name: 'reanudar',
            type: 'SUB_COMMAND',
            description: 'Reanudaré la música.'
        },
        {
            name: 'saltar',
            type: 'SUB_COMMAND',
            description: 'Saltaré la música.',
            options: [
                {
                    name: 'forzar',
                    type: 'BOOLEAN',
                    description: 'Forzar el salto de la música.'
                }
            ]
        },
        {
            name: 'parar',
            type: 'SUB_COMMAND',
            description: 'Saltaré la música.'
        },
    ],
    run: async (client, interaction, args) => {
        guild = interaction.guild
        manualDisconnect = new MessageEmbed()
        .setColor('#dedede')
        .setDescription(`• Me sacaron manualmente del canal de voz. \`Eliminando cola de músicas...\``)
        .setFooter(`Miko`, client.user.displayAvatarURL())
        .setTimestamp()
        let notPlaying = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
            .setDescription(`• No se está reproduciendo nada.`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

        let noVc = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
            .setDescription(`• No estás en un canal de voz.`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()

            
        let nomyVc = new MessageEmbed()
        .setColor('RED')
        .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
        .setDescription(`• No estás en mi canal de voz.`)
        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
        .setTimestamp()



        const [subcommand] = args
        if (subcommand == "escuchar") {
            if (!interaction.member.voice.channel) {
                interaction.followUp({ embeds: [noVc] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                interaction.followUp({ embeds: [nomyVc] })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
            }
            const query = interaction.options.get("titulo").value;
            const searchResults = await player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            }).catch(() => {});
            if (!searchResults) {
                let failure = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                    .setDescription(`• No se encontró ${query}.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                interaction.followUp({ embeds: [failure] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            const queue = await player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });
            canal = interaction.channel
            // verify vc connection

            
            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch (error) {
                let noConnection = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                    .setDescription(`• \`${error}\``)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                // queue.destroy();
                return interaction.followUp({ embeds: [noConnection] }).then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            }

            try {
                if (searchResults.playlist) { await queue.addTracks(searchResults.tracks) } else { await queue.addTrack(searchResults.tracks[0]); }
            }
            catch (error) {
                let failure = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                    .setDescription(`• \`${error}\`.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()

                interaction.followUp({ embeds: [failure] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                return
            }
            if (!queue.playing) await queue.play()
            queue.setVolume(50);


            let embedtrack = new MessageEmbed()
                .setColor('#43B581')
                .setTitle(`**<:greencheck:900148615677358090> Se agregó tu ${searchResults.playlist ? "playlist" : "música"}.**`)
                .setDescription(`• **🎶 | [${searchResults.playlist ? searchResults.playlist.title : searchResults.tracks[0].title}](${searchResults.playlist ? searchResults.playlist.url : searchResults.tracks[0].url})**`)
                .setThumbnail(searchResults.playlist ? searchResults.playlist.thumbnail : searchResults.tracks[0].thumbnail)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()
            return await interaction.followUp({ content: 'Usa \`/musica volumen <porcentaje>\` si el volumen está demasiado alto o bajo.', embeds: [embedtrack] });
        }

        if (subcommand == "pausar") {
            const queue = player.getQueue(interaction.guildId);
            if (!queue?.playing) {
                return interaction.followUp({ embeds: [notPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }
            if (queue.setPaused(true)){
                let alrPause = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                .setDescription(`• La música ya está pausada.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

                return interaction.followUp({ embeds: [alrPause] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }
            else{
            queue.setPaused(true);
            const progress = queue.createProgressBar();
            const perc = queue.getPlayerTimestamp();
            const embedPausa = new MessageEmbed()
                .setTitle('**<:graycheck:903741976061567027> La música fue pausada.**')
                .setThumbnail(queue.current.thumbnail)
                .setColor('#dedede')
                .setDescription(`• **🎶 | [${queue.current.title}](${queue.current.url}) (\`${perc.progress}%\`).\n\n${progress}**`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

           
            return interaction.followUp({ embeds: [embedPausa] });
        }
        }
        if (subcommand == "reanudar") {
            const queue = player.getQueue(interaction.guildId);
            if (!queue?.playing) {
                return interaction.followUp({ embeds: [notPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }
            if (paused){
                let alrPlaying = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                .setDescription(`• La música no está pausada.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

                return interaction.followUp({ embeds: [alrPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }

            const progress = queue.createProgressBar();
            const perc = queue.getPlayerTimestamp();
            const embedReanudar = new MessageEmbed()
                .setTitle('**<:graycheck:903741976061567027> La música fue reanudada.**')
                .setColor('#dedede')
                .setThumbnail(queue.current.thumbnail)
                .setDescription(`**• 🎶 | [${queue.current.title}](${queue.current.url}) (\`${perc.progress}%\`).\n\n${progress}**`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()
            queue.setPaused(false);

            return interaction.followUp({ embeds: [embedReanudar] });
        }
        if (subcommand == 'parar'){
            const queue = player.getQueue(interaction.guildId);
            if (!queue?.playing) {
                return interaction.followUp({ embeds: [notPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }
            queue.destroy();
            const intCreator = interaction.user
            const count = interaction.member.voice.channel.members.size - 1
        }
        if (subcommand == "forzar"){
            if (interaction.member.roles.highest.position >= guild.me.roles.highest.position) {
                if (!queue.tracks[0]) {
                    const skipEndEmbed = new MessageEmbed()
                        .setColor('#dedede')
                        .setDescription(`• La música se saltó, pero no hay más en la cola. Me desconecté.`)
                        .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                        .setTimestamp()
                    interaction.followUp({ embeds: [skipEndEmbed] });
                    await queue.skip();
                    return
                }
                else {
                    let skipEmbed = new MessageEmbed()
                        .setColor('#43B581')
                        .setTitle(`**<:greencheck:900148615677358090> Se saltó la música. Ahora comienza:**`)
                        .setDescription(`• **🎶 | [${queue.tracks[0].title}](${queue.tracks[0].url})**\n\n`)
                        .setThumbnail(queue.tracks[0].thumbnail)
                        .setFooter(`Pedido por ${queue.tracks[0].requestedBy.tag}`, queue.tracks[0].requestedBy.displayAvatarURL())
                        .setTimestamp()
                    interaction.followUp({ embeds: [skipEmbed] });
                    await queue.skip();
                    return
                }
            }
        }
        if (subcommand == "saltar") {
            const queue = player.getQueue(interaction.guildId);
            if (!queue?.playing) {
                return interaction.followUp({ embeds: [notPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }
            const skipEndEmbed = new MessageEmbed()
            .setColor('#dedede')
            .setDescription(`• La música se saltó, pero no hay más en la cola. Me desconecté.`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
            const boolean = interaction.options.getBoolean('forzar');

            console.log(boolean)
            if (boolean == true){
                if (interaction.member.roles.highest.position >= guild.me.roles.highest.position) {
                    if (!queue.tracks[0]) {

                        interaction.followUp({ embeds: [skipEndEmbed] });
                        await queue.skip();
                        return
                    }
                    else {
                        let skipEmbed = new MessageEmbed()
                        .setColor('#43B581')
                        .setTitle(`**<:greencheck:900148615677358090> Se saltó la música. Ahora comienza:**`)
                        .setDescription(`• **🎶 | [${queue.tracks[0].title}](${queue.tracks[0].url})**\n\n`)
                        .setThumbnail(queue.tracks[0].thumbnail)
                        .setFooter(`Pedido por ${queue.tracks[0].requestedBy.tag}`, queue.tracks[0].requestedBy.displayAvatarURL())
                        .setTimestamp()
                        interaction.followUp({ embeds: [skipEmbed] });
                        await queue.skip();
                        return
                    }
                }
                else{
                    let noPerms = new MessageEmbed()
                    .setColor('RED')
                    .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                    .setDescription(`• No tienes suficientes permisos.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                    return interaction.followUp({ embeds: [noPerms] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
                }
            }

            const intCreator = interaction.user
            const count = interaction.member.voice.channel.members.size - 1
            if (count == 1)
            {
                if (!queue.tracks[0]) {

                    interaction.followUp({ embeds: [skipEndEmbed] });
                    await queue.skip();
                    return
                }
                else {
                    let skipEmbed = new MessageEmbed()
                    .setColor('#43B581')
                    .setTitle(`**<:greencheck:900148615677358090> Se saltó la música. Ahora comienza:**`)
                    .setDescription(`• **🎶 | [${queue.tracks[0].title}](${queue.tracks[0].url})**\n\n`)
                    .setThumbnail(queue.tracks[0].thumbnail)
                    .setFooter(`Pedido por ${queue.tracks[0].requestedBy.tag}`, queue.tracks[0].requestedBy.displayAvatarURL())
                    .setTimestamp()
                    interaction.followUp({ embeds: [skipEmbed] });
                    await queue.skip();
                    return
                }
            }
            const idProceed = "pro-" + Math.floor(Math.random() * (100000 - 50000)) + 50000;
            const rowProceed = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji("961777711800520834")
                    .setStyle("SECONDARY")
                    .setCustomId(`${idProceed}`),

                new MessageButton()
                    .setLabel(`1/${count}`)
                    .setStyle("SECONDARY")
                    .setCustomId(`proceedDisabled`)
                    .setDisabled('true')
            )
            if (count == 2) {
                
                participantes.push(interaction.user.id)
                const twoPeopleSkip = new MessageEmbed()
                    .setTitle('<:graywarn:961730637688107078> Confirmen la acción.')
                    .setColor('#dedede')
                    .setDescription(`• Debido a que hay más de una persona en el canal, los dos deben confirmar.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                
                var proceedIndex = 1

                const rowProceedUpdate = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("961777711800520834")
                            .setStyle("SECONDARY")
                            .setCustomId('Completed')
                            .setDisabled('true'),

                        new MessageButton()
                            .setLabel(`2/2`)
                            .setStyle("SECONDARY")
                            .setCustomId(`proceedDisabled`)
                            .setDisabled('true')
                    )

                const rowCancel = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("961777711800520834")
                            .setStyle("SECONDARY")
                            .setCustomId('CompletedDisabled')
                            .setDisabled('true'),

                        new MessageButton()
                            .setLabel(`1/2`)
                            .setStyle("SECONDARY")
                            .setCustomId(`proceedDisabled`)
                            .setDisabled('true')
                    )
                sentMessage = await interaction.followUp({
                    embeds: [twoPeopleSkip], components: [rowProceed]
                })

                var vcMembers = interaction.member.voice.channel.members.map(member => member.id)
                // const filter = i => vcMembers;

                console.log(vcMembers)
                const collector = interaction.channel.createMessageComponentCollector({ time: 21000 });
                collector.on('collect', async i => {

                    if (i.customId === `${idProceed}`) {
                        if (!vcMembers.includes(i.user.id)) return
                        if (participantes.includes(i.user.id)) return
                        const skipEndEmbed = new MessageEmbed()
                            .setColor('#dedede')
                            .setDescription(`• La música se saltó, pero no hay más en la cola. Me desconecté.`)
                            .setFooter(`${i.member.user.tag}`, i.member.displayAvatarURL())
                            .setTimestamp()
                        if (!queue.tracks[0]) {
                            sentMessage.edit({ embeds: [skipEndEmbed], components: [] });
                            await queue.skip();
                            return
                        }
                        else {
                            let skipEmbed = new MessageEmbed()
                                .setColor('#43B581')
                                .setTitle(`**<:greencheck:900148615677358090> Se saltó la música. Ahora comienza:**`)
                                .setDescription(`• **🎶 | [${queue.tracks[0].title}](${queue.tracks[0].url})**\n\n`)
                                .setThumbnail(queue.tracks[0].thumbnail)
                                .setFooter(`Pedido por ${queue.tracks[0].requestedBy.tag}`, queue.tracks[0].requestedBy.displayAvatarURL())
                                .setTimestamp()
                            sentMessage.edit({ embeds: [skipEmbed], components: [] });
                        }
                        setTimeout(() => {
                            sentMessage = ''
                        }, 5000)
                        clearTimeout(time)
                        await queue.skip();
                        return
                    }
                })
                time = setTimeout(() => {

                    collector.on('end', collected => console.log('finish'));

                    sentMessage.edit({ components: [rowCancel] }).catch(error => {
                        console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                    })
                    setTimeout(() => {
                        sentMessage.delete().catch(error => {
                            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                        })
                        return
                    }, 2000)
                }, 20000)

            }
            if (count > 2){
                
                var proceedGoal = Math.floor(count * 0.75)
                
                participantes.push(interaction.user.id)
                const plusTwoPeopleSkip = new MessageEmbed()
                    .setTitle('<:graywarn:961730637688107078> Confirmen la acción.')
                    .setColor('#dedede')
                    .setDescription(`• Debido a que hay más de una persona en el canal, el salto se realizará si el 75% de los miembros del canal de voz están de acuerdo.`)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                var proceedIndex = 1

                const rowProceedUpdate = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("961777711800520834")
                            .setStyle("SECONDARY")
                            .setCustomId('Completed')
                            .setDisabled('true'),

                        new MessageButton()
                            .setLabel(`${proceedIndex}/${proceedGoal}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`proceedDisabled`)
                            .setDisabled('true')
                    )
                    const rowProceedabove2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("961777711800520834")
                            .setStyle("SECONDARY")
                            .setCustomId(`${idProceed}`),
        
                        new MessageButton()
                            .setLabel(`1/${proceedGoal}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`proceedDisabled`)
                            .setDisabled('true')
                    )

                const rowCancel = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("961777711800520834")
                            .setStyle("SECONDARY")
                            .setCustomId('CompletedDisabled')
                            .setDisabled('true'),

                        new MessageButton()
                            .setLabel(`${proceedIndex}/${proceedGoal}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`proceedDisabled`)
                            .setDisabled('true')
                    )
                sentMessage = await interaction.followUp({
                    embeds: [plusTwoPeopleSkip], components: [rowProceedabove2]
                })

                var vcMembers = interaction.member.voice.channel.members.map(member => member.id)
                // const filter = i => vcMembers;

                console.log(vcMembers)
                const collector = interaction.channel.createMessageComponentCollector({ time: 21000 });
                collector.on('collect', async i => {

                    if (i.customId === `${idProceed}`) {
                        if (!vcMembers.includes(i.user.id)) return
                        if (participantes.includes(i.user.id)) return
                        proceedIndex++
                        if (proceedIndex >= proceedGoal ){
                        const skipEndEmbed = new MessageEmbed()
                            .setColor('#dedede')
                            .setDescription(`• La música se saltó, pero no hay más en la cola. Me desconecté.`)
                            .setFooter(`${i.member.user.tag}`, i.member.displayAvatarURL())
                            .setTimestamp()
                        if (!queue.tracks[0]) {
                            sentMessage.edit({ embeds: [skipEndEmbed], components: [] });
                            clearTimeout(time)
                            await queue.skip();
                            return
                        }
                        else {
                            let skipEmbed = new MessageEmbed()
                                .setColor('#43B581')
                                .setTitle(`**<:greencheck:900148615677358090> Se saltó la música. Ahora comienza:**`)
                                .setDescription(`• **🎶 | [${queue.tracks[0].title}](${queue.tracks[0].url})**\n\n`)
                                .setThumbnail(queue.tracks[0].thumbnail)
                                .setFooter(`Pedido por ${queue.tracks[0].requestedBy.tag}`, queue.tracks[0].requestedBy.displayAvatarURL())
                                .setTimestamp()
                                clearTimeout(time)
                            sentMessage.edit({ embeds: [skipEmbed], components: [] });
                        }
                        setTimeout(() => {
                            sentMessage = ''
                        }, 5000)
                        clearTimeout(time)
                        await queue.skip();
                        return
                    }
                    else{
                        sentMessage.edit({ components:[rowProceedUpdate]})
                    }
                }
                })
                time = setTimeout(() => {

                    collector.on('end', collected => console.log('finish'));

                    sentMessage.edit({ components: [rowCancel] }).catch(error => {
                        console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                    })
                    setTimeout(() => {
                        sentMessage.delete().catch(error => {
                            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                        })
                    }, 2000)
                }, 20000)

            }
        }
        if (subcommand == "volumen") {
            const volumePercentage = interaction.options.getInteger("porcentaje");
            const queue = player.getQueue(interaction.guildId);
            const embedVolume = new MessageEmbed()
                .setColor('#dedede')
                .setDescription(`• El volumen es de \`${queue.volume}%\`.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

            const embednewVolume = new MessageEmbed()
                .setColor('#dedede')
                .setDescription(`• El volumen se ajustó a \`${volumePercentage}%\`.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

            let above100 = new MessageEmbed()
                .setColor('RED')
                .setTitle("**<:redx:900360448292040775> Ocurrió un error.**")
                .setDescription(`• El volumen debe estar entre 1 y 100.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()

            if (!queue?.playing) {
                return interaction.followUp({ embeds: [notPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }

            if (!volumePercentage)
                return interaction.followUp({
                    embeds: [embedVolume]
                });

            if (volumePercentage < 0 || volumePercentage > 100)
                return interaction.followUp({
                    embeds: [above100]
                });

            queue.setVolume(volumePercentage);

            return interaction.followUp({
                embeds: [embednewVolume]
            });
        }
        if (subcommand == "cola") {
            const queue = player.getQueue(interaction.guildId);
            if (!queue?.playing) {
                return interaction.followUp({ embeds: [notPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }

            const currentTrack = queue.current;
            const tracks = queue.tracks.slice(0, 10).map((m, i) => {
                return `${i + 1} - **[${m.title}](${m.url})** - ${m.requestedBy.tag
                    }`;
            });

            return interaction.followUp({
                embeds: [
                    {
                        title: "<:graycheck:903741976061567027> Cola de músicas",
                        description: `${tracks.join("\n")}${queue.tracks.length > tracks.length ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} más música`
                            : `${queue.tracks.length - tracks.length
                            } músicas más`
                            }`
                            : ""
                            }`,
                        color: "#DEDEDE",
                        fields: [
                            {
                                name: "• Reproduciendo ahora",
                                value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
                            },
                        ],
                        footer: {
                            text: 'Miko',
                            icon_url: client.user.displayAvatarURL(),
                        }
                    },

                ],
            });
        }
        if (subcommand == "titulo") {
            const queue = player.getQueue(interaction.guildId);
            if (!queue?.playing) {
                return interaction.followUp({ embeds: [notPlaying] })
                    .then(msg => {
                        setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /musica\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                    })
            }

            const progress = queue.createProgressBar();
            const perc = queue.getPlayerTimestamp();

            return interaction.followUp({
                embeds: [
                    {
                        title: "<:graycheck:903741976061567027> Estás escuchando:",
                        description: `**• 🎶 | [${queue.current.title}](${queue.current.url}) (\`${perc.progress}%\`)\n\n${progress}**`,
                        color: "#DEDEDE",
                        thumbnail: {
                            url: queue.current.thumbnail
                        },
                        footer: {
                            text: `Pedido por ${queue.current.requestedBy.tag}`,
                            icon_url: queue.current.requestedBy.displayAvatarURL()
                        },
                    },
                ],
            });
        }
    }

};
