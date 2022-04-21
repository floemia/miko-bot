const mongoose = require('mongoose')



module.exports = mongoose.model('mutes', 
new mongoose.Schema({
    guildid: String,
    user: String,
    moderatorId: String,
    reason: String,
    duration: Number,
    timestamp: Number,
    

})
) 