const { Message, Client } = require("discord.js");

module.exports = {
    name: "say",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        if (!message.member.permissions.has("BAN_MEMBERS")) {
            message.delete()
            message.reply("callese")
                .then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.log(`\n\nAN ERROR HAS OCURRED.\nCOMMAND: /kick\nEXECUTED BY: ${interaction.member.user.tag}\nERROR: ${error}\nBOT IS STILL RUNNING.\n\n`)), 3000)
                    return
                })
            }
            else{
        const SayMessage = message.content.slice(5).trim();
        message.delete()
        message.channel.send({ content: SayMessage })
            }
    
    
}
}
