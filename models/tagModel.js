const mongoose = require('mongoose')



module.exports = mongoose.model('tag', 
new mongoose.Schema({
    guildid: String,
    tagname: String,
    tagcontent: String,
    tagatt: String,
    tagcolor: String,
    tagauthor: String
})
) 