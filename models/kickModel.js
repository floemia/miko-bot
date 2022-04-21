const mongoose = require('mongoose')



module.exports = mongoose.model('kick', 
new mongoose.Schema({
    guildid: String,
    user: String,
    moderatorId: String,
    reason: String,
    timestamp: Number,
    

})
) 