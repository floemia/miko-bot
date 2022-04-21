const mongoose = require('mongoose')



module.exports = mongoose.model('osuaccounts', 
new mongoose.Schema({
    osuAccName: String,
    osuAccOwner: String,

})
) 