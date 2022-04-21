const { Client, Collection, MessageEmbed, MessageAttachment } = require("discord.js");
const { CommandInteractionOptionResolver, Permissions } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const moment = require('moment');
var participantes = new Array()
const cooldownModel = require('./models/cooldownModel.js')
var premios = new Array()
const client = new Client({
  intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");
const filter = require('./filter.json');
const packageJSON = require("./package.json");

// Initializing the project
require("./handler")(client);


client.login(client.config.token);
const rowSorteoover = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setEmoji("912454354911498282")
      .setStyle("SUCCESS")
      .setCustomId("sorteoProcederOver")
      .setDisabled("true")
  )
const rowSorteo = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setEmoji("912454354911498282")
      .setStyle("SUCCESS")
      .setCustomId("sorteoProceder")
  )
try {
  client.on("ready", (message) => {
    const datenow = moment().utc().format('LLLL')
    console.log(datenow)
    let index = 0
    const activities_list = [
      "yooo",
      "el chat",
      "a mis amigos",
      "el cielo nublado",
      "osu!"
    ];
    setInterval(() => {
      index++;
      if (index == 1) {
        client.user.setActivity(activities_list[index], { type: 'WATCHING' });
      }
      if (index == 2) {
        client.user.setActivity(activities_list[index], { type: 'LISTENING' });
      }
      if (index == 3) {
        client.user.setActivity(activities_list[index], { type: 'WATCHING' });
      }
      if (index == 4) {
        client.user.setActivity(activities_list[index], { type: 'PLAYING' });
        index = 0
      }
      if (index == 5) {
        index = 0
      }

    }, 10000);


    var isSent
    var timestartup = moment().utc().format('LLLL')
    const discordJSVersion = packageJSON.dependencies["discord.js"];
    console.log(`\n\nNAOKI MIKI PROJECT IS RUNNING.\nBOT USERNAME: ${client.user.tag}\nEXACT STARTUP DATE (UTC): ${timestartup}\nDISCORD.JS: V${discordJSVersion}\nRELEASE: V1.3 - 15-11-2021\n\n`)
    const guild = client.guilds.cache.get(client.config.guild);
    var antiJoin = 1;
    var antijoinRegreso = setInterval(function () {
      antiJoin = 1
    }, 60000);
    client.on('guildMemberAdd', member => {

      antiJoin = antiJoin + 1
      var antijoinTimer = setInterval(function () {
        if (antiJoin >= 10) {
          clearInterval(antijoinTimer);
          clearInterval(antijoinRegreso)
        }
      }, 10000);
    })
    if (antiJoin >= 10) {
      member.kick()
    }


    client.on('guildMemberRemove', async member => {
      if (member.user.bot) return
      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
      });
      const fetchedBanLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_ADD_BAN',
      });
      // Since there's only 1 audit log entry in this collection, grab the first one
      const kickLog = fetchedLogs.entries.first();
      const banLog = fetchedBanLogs.entries.first();
      if (!kickLog) {
        let embedleft = new MessageEmbed()
          .setColor("RED")
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
          .setTitle(`**<:redwarn:903008123550335046> Un usuario se fue del servidor.**`)
          .setDescription(`• Adiós, ${member.user.tag}.`)
          .setFooter(`Miko`, client.user.displayAvatarURL())
          .setTimestamp();
        const channellog = client.channels.cache.get(client.config.logchannel)
        return channellog.send({ embeds: [embedleft] })
      }else {
      const { executor, target, reason } = kickLog;

      if (target.id === member.id) {

        let kickLog = new MessageEmbed()
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setColor('RED')
          .setTitle(`**<:redwarn:903008123550335046> Un usuario ha sido kickeado.**`)
          .addField("**• Usuario**", `${member.user.tag}`)
          .addField("**• Razón**", `\`${reason || 'No se especificó una razón.'}\``)
        if (executor.id == "953705293345325146") {
          kickLog.setFooter(`Miko`, executor.displayAvatarURL())
        } else {
          kickLog.setFooter(executor.tag, executor.displayAvatarURL())
        }
        kickLog.setTimestamp()
        const channellog = client.channels.cache.get(client.config.logchannel)
        return channellog.send({ embeds: [kickLog] })
      }
    }
    if(banLog){
      const { executor, target, reason } = banLog;

      if (target.id === member.id) {

        let kickLog = new MessageEmbed()
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setColor('RED')
          .setTitle(`**<:redwarn:903008123550335046> Un usuario ha sido baneado.**`)
          .addField("**• Usuario**", `${member.user.tag}`)
          .addField("**• Razón**", `\`${reason || 'No se especificó una razón.'}\``)
        if (executor.id == "953705293345325146") {
          kickLog.setFooter(`Miko`, executor.displayAvatarURL())
        } else {
          kickLog.setFooter(executor.tag, executor.displayAvatarURL())
        }
        kickLog.setTimestamp()
        const channellog = client.channels.cache.get(client.config.logchannel)
        return channellog.send({ embeds: [kickLog] })
      }
    }

    });

    var indice = 0
    client.on(`messageCreate`, async (message) => {
      if (!message.guild) return;

      var index
      var premios = [
        "1 mes de osu!supporter",
        "1 mes de Nitro Classic",
        "Una cajita de lol",
        "310 diamantes de free fire",
        "Juego de Steam hasta 5 usd",
        "Bendicion lunar del Genshin Impact"
      ]
      if (isSent == 1) return
      if (message.author.bot) return
      cooldowndbFetch = await cooldownModel.findOne({ trigger: '1' })
      let dateNow = new Date()
      let dateSorteo = dateNow.getTime() + 432000000
      if (!cooldowndbFetch) {
        new cooldownModel({
          dateFinCooldown: dateSorteo,
          trigger: '1'
        }).save()
        return
      }
      cooldownTime = cooldowndbFetch.dateFinCooldown
      if (Date.now() < cooldownTime) {
        return
      }

      let NumeroSorteo = Math.floor(Math.random() * (100000000 - 5000000)) + 5000000;
      let stringSorteo = `miko-${NumeroSorteo}`
      let embedsorteo = new MessageEmbed()
        .setColor('#43B581')
        .setTitle(`**<:greencheck:900148615677358090> ¡Comenzaste un sorteo!**`)
        .setDescription(`• ¡Rápido, toca el botón para participar! No hay participantes aún.`)
        .setFooter(`Miko`, client.user.displayAvatarURL())
        .setTimestamp()

      let embedend = new MessageEmbed()
        .setColor('#43B581')
        .setTitle(`**<:greencheck:900148615677358090> El sorteo terminó.**`)
        .setDescription(`• Mantente atento para el siguiente.`)
        .setFooter(`Miko`, client.user.displayAvatarURL())
        .setTimestamp()

      function probability(n) {
        return Math.random() < n;
      }
      var prob = 0.002;

      let sorteochannel = client.channels.cache.get("947576521764241448")
      if (message.channel.id == '947576521764241448' && probability(prob)) {
        cooldowndbFetch.delete()
        isSent = 1
        try {
          const mensaje = await message.reply({ embeds: [embedsorteo], components: [rowSorteo] })

          setTimeout(() => {
            mensaje.edit({ components: [rowSorteoover] })
            let notEnough = new MessageEmbed()
              .setColor('RED')
              .setTitle("**<:redx:900142062568079460> El sorteo no se pudo realizar.**")
              .setDescription("• Se necesitan más de 5 personas.")
              .setFooter(`Miko`, client.user.displayAvatarURL())
              .setTimestamp()

            let troleo = new MessageEmbed()
              .setColor('RED')
              .setTitle("**<:redx:900142062568079460> El sorteo no se pudo realizar.**")
              .setDescription("• Meh, no quise hacerlo.")
              .setFooter(`Miko`, client.user.displayAvatarURL())
              .setTimestamp()

            if (participantes.length < 5) {
              sorteochannel.send({ embeds: [notEnough] })
              return
            }
            sorteochannel.send({ embeds: [troleo] })
            setTimeout(() => {
              indexPremio = Math.floor(Math.random() * premios.length)
              index = Math.floor(Math.random() * participantes.length)
              let embedganador = new MessageEmbed()
                .setColor('#43B581')
                .setTitle(`**<:greencheck:900148615677358090> JA SE LA RE CREYERON**`)
                .setDescription(`• ¡Felicidades, <@${participantes[index]}>, ganaste!`)
                .addField("**• Premio**", `${premios[indexPremio]}`)
                .setFooter(`Miko`, client.user.displayAvatarURL())
                .setTimestamp()
              sorteochannel.send({ content: `<@${participantes[index]}>`, embeds: [embedganador] })
              console.log(participantes)
              return
            }, 10000)

          }, 20000)
        } catch (error) { }
      }
    })

    client.on("interactionCreate", async (interaction) => {
      if (interaction.customId === 'sorteoProceder') {
        if (participantes.includes(interaction.user.id)) return
        indice++
        let embedsorteo = new MessageEmbed()
          .setColor('#43B581')
          .setTitle(`**<:greencheck:900148615677358090> ¡Comenzaste un sorteo!**`)
          .setDescription(`• ¡Rápido, toca el botón para participar! Hay ${indice} participante(s).`)
          .setFooter(`Miko`, client.user.displayAvatarURL())
          .setTimestamp()
        interaction.update({ embeds: [embedsorteo], components: [rowSorteo] })
        participantes.push(interaction.user.id)
      }
    })


    client.on('messageCreate', message => {
      if (!message.guild) return;
      try {
        if (message.author.bot) return
        const mentionmember = message.mentions.members.first()
        if (message.author.id == client.user.id) return;
        const mentionchannel = message.guild.channels.cache.get(message.channel.id)
        const url = message.url
        var nope = "Sin mensaje, sólo media"
        if (message.mentions.members.first()) {
          var messageHadAttachment
          try {
            messageHadAttachment = message.attachments.first().proxyURL
          } catch {
          }
          const mentionlog = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(mentionmember.displayAvatarURL({ dynamic: true }))
            .setTitle(`**<:redwarn:903008123550335046> Un usuario fue mencionado.**`)
            .setDescription(`${mentionmember} mencionado por ${message.author} | [Ir al mensaje](${url})`)
            .addField(`• Contenido del mensaje:`, `${message.content ? message.content : nope}`)
            .addField(`• En el canal:`, `${mentionchannel}`)
            .setFooter(`Miko`, client.user.displayAvatarURL())
            .setTimestamp();

          if (messageHadAttachment) {
            mentionlog.addField(`• Link del primer archivo adjunto:`, `${messageHadAttachment}`)
            mentionlog.setImage(messageHadAttachment)
          }

          const channellog = client.channels.cache.get(client.config.logchannel)
          channellog.send({ embeds: [mentionlog] })

        }
        return
      }
      catch (error) {
        console.log(`\n\nAN ERROR HAS OCURRED.\nMESSAGE MENTION FETCH\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)
      }

    });

    client.on('messageDelete', async message => {
      if (!message.guild) return;
      const member = message.author;
      let delchan = message.guild.channels.cache.get(message.channel.id)
      if (member.id == client.user.id) return;
      if (message.author.bot) return
      var nope = "Sin mensaje, sólo media"
      var messageHadAttachment
      try {
        messageHadAttachment = message.attachments.first().proxyURL
      } catch { }
      const entry = await message.guild.fetchAuditLogs({ type: "MESSAGE_DELETE" }).then(audit => audit.entries.first())
      var delAuthor
      try {
        console.log(message.id)
        if (entry.extra.channel.id === message.channel.id
          && (entry.target.id === message.author.id)
          && (entry.createdTimestamp > (Date.now() - 5000))
          && (entry.extra.count >= 1)) {
          delAuthor = entry.executor
        }
        const msgdellog = new MessageEmbed()
          .setColor("RED")
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
          .setTitle(`**<:redwarn:903008123550335046> Un mensaje fue eliminado.**`)
          .setDescription(`${member}`)
          .addField(`• Contenido del mensaje:`, `${message.content ? message.content : nope}`)
          .addField(`• En el canal:`, `${delchan}`)
        if (delAuthor) {
          msgdellog.addField(`• Borrado por:`, `<@${delAuthor.id}>`)
        }
        msgdellog.setFooter(`Miko`, client.user.displayAvatarURL())
        msgdellog.setTimestamp();
        if (messageHadAttachment) {
          console.log(`\n\n${messageHadAttachment}\n\n`)
          msgdellog.addField(`• Link del primer archivo adjunto:`, `${messageHadAttachment}`)
          msgdellog.setImage(messageHadAttachment)
        }
        const channellog = client.channels.cache.get(client.config.modlogchannel)
        return channellog.send({ embeds: [msgdellog] })
      } catch (error) {
        console.log(error)
        return
      }
    })

    client.on('guildMemberUpdate', async (oldMember, newMember) => {
      if (oldMember.nickname !== newMember.nickname) {
        const fetchedLogs = await newMember.guild.fetchAuditLogs({
          limit: 1,
          type: 'MEMBER_UPDATE',
        });
        const deletionLog = fetchedLogs.entries.first();
        if (newMember.user.bot) return
        const { executor, target } = deletionLog;

        const nicklog = new MessageEmbed()
          .setColor("RED")
          .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
        if (oldMember.nickname == undefined) {
          nicklog.setTitle(`**<:redwarn:903008123550335046> Un usuario se puso un apodo.**`)
        }
        if (newMember.nickname == undefined) {
          nicklog.setTitle(`**<:redwarn:903008123550335046> Un usuario se quitó el apodo.**`)
        }
        if (newMember.nickname) {
          nicklog.setTitle(`**<:redwarn:903008123550335046> Un usuario se cambió el apodo.**`)
        }
        nicklog.setDescription(`${newMember}`)
        if (oldMember.nickname == undefined) {
          nicklog.addField(`• Apodo viejo:`, `\`Sin apodo\``)
        }
        else {
          nicklog.addField(`• Apodo viejo:`, `\`${oldMember.nickname}\``)
        }
        if (newMember.nickname == undefined) {
          nicklog.addField(`• Nuevo apodo:`, `\`Sin apodo\``)
        }
        else {
          nicklog.addField(`• Nuevo apodo:`, `\`${newMember.nickname}\``)
        }
        if (executor.id != newMember.id) { nicklog.addField(`• Cambiado por:`, `<@${executor.id}>`) }
        nicklog.setFooter(`Miko`, client.user.displayAvatarURL())
        nicklog.setTimestamp();
        const channellog = client.channels.cache.get(client.config.logchannel)
        channellog.send({ embeds: [nicklog] })
      }
    })

    client.on('messageUpdate', (oldMessage, newMessage) => { // Old message may be undefined
      if (!oldMessage.author) return;
      if (newMessage.author.bot) return
      if (oldMessage.content == newMessage.content) return
      if (newMessage.author.id == client.user.id) return;
      var nope = "Sin mensaje, sólo media"
      const msgurl = newMessage.url
      var messageHadAttachment
      try {
        messageHadAttachment = newMessage.attachments.first().proxyURL
      } catch {
      }
      const embededit = new MessageEmbed()
        .setColor("RED")
        .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
        .setTitle(`**<:redwarn:903008123550335046> Un usuario editó un mensaje.**`)
        .setDescription(`${newMessage.author} | [Ir al mensaje](${msgurl})`)
        .addField('• Mensaje viejo:', `${oldMessage.content ? oldMessage.content : nope}`)
        .addField('• Mensaje nuevo:', `${newMessage.content ? newMessage.content : nope}`)
        .setFooter(`Miko`, client.user.displayAvatarURL())
        .setTimestamp();
      if (messageHadAttachment) {
        embededit.addField(`• Link del primer archivo adjunto:`, `${messageHadAttachment}`)
        embededit.setImage(messageHadAttachment)
      }

      const channellog = client.channels.cache.get(client.config.modlogchannel)
      channellog.send({ embeds: [embededit] })
    })
  })
} catch (error) {

  console.log(`\n\nAN ERROR HAS OCURRED.\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)

}