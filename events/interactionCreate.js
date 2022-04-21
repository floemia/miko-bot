const { CommandInteractionOptionResolver, MessageEmbed, Permissions } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { channels } = require("../index");
const guild = "953714119029166100"
const client = require("../index");
client.config = require("../config.json");
// const { embed1 } = require('../SlashCommands/info/help')

// const { embed2 } = require('../SlashCommands/info/help')
client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => { });

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);

    }
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }

    if (interaction.isButton) {
        if (interaction.customId === 'verification') {
            const verifRole = interaction.guild.roles.cache.find(
                (role) => role.name === "Sin verificar")
            const Miembro = interaction.guild.roles.cache.find(
                (role) => role.name === "Miembro")
            const Helper = interaction.guild.roles.cache.find(
                (role) => role.name === "Helper")
            const Mods = interaction.guild.roles.cache.find(
                (role) => role.name === "Moderador")
            if (interaction.member.roles.cache.has(Miembro.id)) {
                return
            }
            setTimeout(() => {
            interaction.member.roles.add(verifRole)
        }, 3000)
            const idTicket = Math.floor(Math.random() * (100 - 1)) + 1;

            interaction.guild.channels.create('︙ticket-' + interaction.member.user.discriminator + `-${idTicket}`, {
                type: 'GUILD_TEXT'

            }).then(async channel => {
                let embedConfirmacion = new MessageEmbed()
                .setTitle(`**<:greencheck:900148615677358090> Ticket creado exitosamente.**`)
                .setColor('#43B581')
                .setDescription(`• Ve al canal <#${channel.id}> para continuar con el proceso de verificación.`)
                .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                .setTimestamp()
                await interaction.deferReply({ephemeral: true });
                await interaction.editReply({ embeds: [embedConfirmacion]})
                channel.setParent('947883841425670164')                
                channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: interaction.member.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: Miembro.id,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: Mods.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                    },
                    {
                        id: Helper.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                    },
                    {
                        id: Miembro.id,
                        deny: [Permissions.FLAGS.SEND_MESSAGES],
                    },
                ]);
                let embedbienv = new MessageEmbed()
                    .setTitle(`**<:greencheck:900148615677358090> Bienvenido/a al clan Miko's Gang.**`)
                    .setColor('#43B581')
                    .setDescription('En este lugar tenemos comunidad muy unida y activa, donde podrás conversar de diversos temas, además de poder participar por diferentes tipos de premios, por la participación activa en el servidor o de participar de diferentes tipos de eventos del clan.\n\nSi quieres hacer paso para ingresar al clan, debes leer los siguientes requisitos y estar de acuerdo con todos los puntos mencionados a continuación:\n\n```                      Identidad Única                      ```\nPara hacer renombre del clan necesitamos que cambies tu username de osu!droid y/o osu! añadiéndoles las siglas del clan: **"[ MG ]"**. Por ejemplo: **[ MG ] Miko**\n\n```                      Toxicidad Fuera!                      ```\nTrata de evitar ser tóxico/a con el resto de los miembros, a menos que tengas la suficiente confianza con la gente con la que estas hablando para que esto no se vuelva un ambiente conflictivo.\n\n```                       Identificación                       ```\nPara evitar la suplantación de identidad, necesitamos corroborar que en verdad eres tú. Para eso necesitarás pasar una captura de tu perfil de osu! y/o osu!droid, así nos evitamos diversos tipos de problemas a futuro.')
                    .setFooter(`${interaction.member.user.tag}`, interaction.member.displayAvatarURL())
                    .setTimestamp()
                    setTimeout(() => {
                channel.send({ content: `||<@${interaction.member.id}>||`, embeds: [embedbienv] })
            },2000)

                const ticketLog = new MessageEmbed()
                    .setColor('#43B581')
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`**<:greencheck:900148615677358090> Se abrió un ticket para ${interaction.member.user.tag}.**`)
                    .setDescription(`• El número del ticket es \`${interaction.member.user.discriminator}-${idTicket}\`. Si no existe, el usuario ya fue verificado.\n\n• <#${channel.id}>`)
                    .setFooter(`Miko`, client.user.displayAvatarURL())
                    .setTimestamp()

                client.channels.cache.get(client.config.ticketlogchannel).send({ embeds: [ticketLog] })
            })

                ;
        }
    }




});
