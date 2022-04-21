const mongoose = require('mongoose')



module.exports = mongoose.model('cooldownSorteo', 
new mongoose.Schema({
    dateFinCooldown: String,
    trigger: String,
})
) 