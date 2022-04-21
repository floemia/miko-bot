const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const Discord = require("discord.js")
const tagModel = require('../../models/tagModel')
// const tagModelATT = require('../../models/tagModelATT')
var timeleft = 20;
var cooldown = 0
module.exports = {
    name: "tag",
    description: "Sistema de Tags (similar a Alice).",
    options: [
        {
            name: 'añadir',
            description: "Añade un tag a la base de datos.",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'nombre',
                    description: 'Nombre del tag.',
                    type: 'STRING',
                    required: true,
                },

                {
                    name: 'contenido',
                    description: 'Contenido del tag.',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'media',
                    description: 'LINK DIRECTO a la foto o gif que quieres incluir.',
                    type: 'STRING',
                    required: false,
                },

                {
                    name: 'color',
                    description: 'Color del embed en formato HEX (#FFFFFF).',
                    type: 'STRING',
                    required: false,
                },
            ],
        },
        {
        name: 'ver',
        description: 'Muestra un tag.',
        type: 'SUB_COMMAND',
        options: [
            {
                name: 'nombre',
                description: 'Nombre del tag.',
                type: 'STRING',
                required: true,
            },
        ],
    },
    {
    name: 'borrar',
    description: 'Borra un tag que TÚ creaste.',
    type: 'SUB_COMMAND',
    options: [
        {
            name: 'nombre',
            description: 'Nombre del tag.',
            type: 'STRING',
            required: true,
        },
    ],
}


    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, message) => {
        var time
        let errcool = new MessageEmbed()
            .setColor('RED')
            .setTitle("**<:redx:900360448292040775> Tengo algunas limitaciones.**")
            .setDescription(`• Espera ${timeleft} segundos. Luego podrás ejecutar el comando.`)
            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
            .setTimestamp()
        if (cooldown == 1) {
            interaction.followUp({
                embeds: [errcool]
            })
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tagadd\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
            return
        }
        var downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                cooldown = 0
                clearInterval(downloadTimer);
            }
            timeleft -= 1;
        }, 1000);
        timeleft = 20
        cooldown = 1
        const [ subcommand ] = args
        if (subcommand == 'añadir')
        {
            const rowcancel = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setEmoji("912454354911498282")
                        .setStyle("SUCCESS")
                        .setCustomId("atras5")
                        .setDisabled('true'),
    
                    new MessageButton()
                        .setEmoji('900142062568079460')
                        .setStyle("DANGER")
                        .setCustomId("cancel")
                        .setDisabled('true'),
                )
            const intuser = interaction.member.user.id
            const filter = i => i.user.id === intuser;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
            const taginput = interaction.options.getString('nombre');
            const tagcont = interaction.options.getString('contenido');
            const tagurl = interaction.options.getString('media');
            const tagcolor = interaction.options.getString('color');
            const tagv = await tagModel.findOne({ tagname: taginput })
            const denied = new MessageEmbed()
            .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                .setColor("RED")
                .setDescription(`• El nombre de este tag está en uso.`)
                .setFooter(`Miko`, client.user.displayAvatarURL())
                .setTimestamp()
    
            try {
                if (tagv.tagname == taginput) {
                    interaction.followUp({
                        embeds: [denied]
                    })
                        .then(msg => {
                            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tag add\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        })
                    return
                }
            }
            catch {
                var nope = "Nothing"
                const confirmation = new MessageEmbed()
                if (!tagcolor) {
                    confirmation.setColor('#DEDEDE')
                }
                else {
                    try {
                        confirmation.setColor(tagcolor)
                    }
                    catch (error) {
                        let crash = new MessageEmbed()
                            .setColor('RED')
                            .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                            .setDescription(`\`${error}\``)
                            .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                            .setTimestamp()
    
                        interaction.followUp({ embeds: [crash] })
                        console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tagadd\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                        return
                    }
                }
                confirmation.setDescription(`${tagcont || nope}`)
                confirmation.setAuthor(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
    
                const rowconfirm = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setEmoji("912454354911498282")
                            .setStyle("SUCCESS")
                            .setCustomId("proceed"),
    
                        new MessageButton()
                            .setEmoji('900142062568079460')
                            .setStyle("DANGER")
                            .setCustomId("desist")
                    )
                let embedsuccess = new MessageEmbed()
                    .setColor('#43B581')
                    .setTitle(`**<:greencheck:900148615677358090> "${taginput}" ahora está en la base de datos.**`)
                    .setDescription(`• Escribe \`/tag ver ${taginput}\` para verlo. `)
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
    
                if (tagurl) {
                    try {
                        confirmation.setImage(tagurl)
                        const sentMessage = await interaction.followUp({
                            content: `El tag ${taginput} se verá **así.**`,
                            ephemeral: true,
                            embeds: [confirmation],
                            components: [rowconfirm]
    
                        }).catch(error => {
                            let crash = new MessageEmbed()
                                .setColor('RED')
                                .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                                .setDescription(`\`${error}\``)
                                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                                .setTimestamp()
                            setTimeout(() =>{
                                clearTimeout(time)
                            }, 5000)
                            interaction.followUp({ embeds: [crash] })
                            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tagadd\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                        })
                        collector.on('collect', async i => {
    
                            if (i.customId === 'proceed') {
                                new tagModel({
                                    guildid: interaction.guildId,
                                    tagname: taginput,
                                    tagcontent: tagcont,
                                    tagatt: tagurl,
                                    tagcolor: tagcolor || "#DEDEDE",
                                    tagauthor: interaction.member.user.id
                                }).save()
                                sentMessage.edit({ content:'Hecho!', embeds: [embedsuccess], components: [] });
                                clearTimeout(time)
                                return
                            }
    
                            if (i.customId === 'desist') {
                                sentMessage.delete()
                                clearTimeout(time)
                                return
                            }
    
                        })
                        time = setTimeout(() => {
    
                            collector.on('end', collected => console.log('finish'));
        
                            sentMessage.edit({ components: [rowcancel]}).catch(error => {
                                console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tagadd\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                            })
                            setTimeout(() => {
                                sentMessage.delete().catch(error => {
                                    console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tagadd\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                                })
                            }, 2000)
                        }, 10000)
                    } catch (error) {
                        interaction.followUp({ content: `${error}` })
                        return
                    }
    
                }
                else {
                    const sentMessage = await interaction.followUp({
                        content: `El tag ${taginput} se verá **así.** \nConfirma tu acción tocando un botón de abajo.`,
                        embeds: [confirmation],
                        components: [rowconfirm]
                    })
                    collector.on('collect', async i => {
    
                        if (i.customId === 'proceed') {
                            sentMessage.edit({ content: "Hecho!", embeds: [embedsuccess], components: [] });
                            new tagModel({
                                guildid: interaction.guildId,
                                tagname: taginput,
                                tagcontent: tagcont,
                                tagatt: '0734619825',
                                tagcolor: tagcolor || "#DEDEDE",
                                tagauthor: interaction.member.user.id
                            }).save();
                            clearTimeout(time)
                            return
                        }
    
                        if (i.customId === 'desist') {
                            sentMessage.delete()
                            clearTimeout(time)
                            return
                        }
    
                    })
                    time = setTimeout(() => {
    
                        collector.on('end', collected => console.log('finish'));
    
                        sentMessage.edit({ components: [rowcancel]}).catch(error => {
                            console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tagadd\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                        })
                        setTimeout(() => {
                            sentMessage.delete().catch(error => {
                                console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tagadd\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
                            })
                        }, 2000)
                    }, 10000)
    
                }
    
            }
        }
        
        if (subcommand == 'borrar')
        {
            try{
            const taginput = interaction.options.getString('nombre');
            const tagv = await tagModel.findOne({ tagname: taginput })
            const customcolor = tagv.tagcolor
            var nope = "Nothing"
            console.log(`${taginput}`)
      
            const tagnotag = new MessageEmbed()
              .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
              .setColor("RED")
              .setDescription(`• Este tag no existe.`)
              .setFooter(`${interaction.member.user.tag}`, client.user.displayAvatarURL())
              .setTimestamp()
      
      
            const tagnoperms = new MessageEmbed()
              .setTitle("**<:redx:900360448292040775> No puedes.**")
              .setColor("RED")
              .setDescription(`• No eres el autor de este tag.`)
              .setFooter(`${interaction.member.user.tag}`, client.user.displayAvatarURL())
              .setTimestamp()
      
      
            let embedsuccess = new MessageEmbed()
              .setColor('#43B581')
              .setTitle(`**<:greencheck:900148615677358090> Lo he borrado.**`)
              .setDescription(`• El tag \`"${taginput}"\` desapareció.`)
              .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
              .setTimestamp()
      
            if (!tagv) {
              interaction.followUp({
                embeds: [tagnotag]
              })
                .then(msg => {
                  setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tag borrar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                })
              return
            }
      
            if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
              try {
                tagv.delete()
                interaction.followUp({
                  embeds: [embedsuccess]
                })
              } catch (error) {
                interaction.followUp({ content: `${error}` })
              }
              return
            }
      
            if (interaction.member.user.id != tagv.tagauthor) {
            interaction.followUp({
              embeds: [tagnoperms]
            })
              .then(msg => {
                setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tag borrar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
              })
            return
          }
          else{
            try {
              tagv.delete()
              interaction.followUp({
                embeds: [embedsuccess]
              })
            } catch (error) {
              interaction.followUp({ content: `${error}` })
            }
            return
          }
        }
        catch(error) {
          console.log(`${error}`)
          const tagnoname = new MessageEmbed()
          .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
          .setColor("RED")
          .setDescription(`${error}`)
          .setFooter(`naoki miki`, client.user.displayAvatarURL())
          .setTimestamp()
          
                console.log(`${error}`)
                interaction.followUp({
                  embeds: [tagnoname]
              })
                  .then(msg => {
                      setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tag borrar\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                  })
                  return
      
        }
        }
        if (subcommand == 'ver')
        {
            try {
                const taginput = interaction.options.getString('nombre');
                const tagv = await tagModel.findOne({ tagname: taginput })
                const customcolor = tagv.tagcolor
                var nope = "Nothing"
                console.log(`${taginput}`)
                  const tagview = new MessageEmbed()
                  .setAuthor(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setColor(customcolor)
                    .setDescription(`${tagv.tagcontent || nope}`)
                  if (tagv.tagatt != '0734619825') {
                    try {
                      tagview.setImage(tagv.tagatt)
                    }
                    catch(error){
                      console.log(`${error}`)
                      interaction.followUp({ content: `${error}` })
                    }
                    interaction.followUp({ embeds: [tagview] })
                    return
                  }
                  else
                  {
                    interaction.followUp({ embeds: [tagview] })
                  }
                }
              catch(error){
                const tagnoname = new MessageEmbed()
                .setTitle("**<:redx:900360448292040775> Un error ocurrió.**")
                .setColor("RED")
                .setDescription(`${error}`)
                .setFooter(`naoki miki`, client.user.displayAvatarURL())
                .setTimestamp()
            
                      console.log(`${error}`)
                      interaction.followUp({
                        embeds: [tagnoname]
                    })
                        .then(msg => {
                            setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /tag view\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 6000)
                        })
                        return
                
            
              }
        }
        }
    }
