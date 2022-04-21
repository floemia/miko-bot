const mongoose = require('mongoose')



module.exports = mongoose.model('warnings', 
new mongoose.Schema({
    guildid: String,
    user: String,
    moderatorId: String,
    reason: String,
    timestamp: Number,

})
) 