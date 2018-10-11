const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    file_name: {type:String,required:true},
    is_avatar: {type:Boolean,default:false},
    file_url: {type:String,required:true},
    created: {type: Date, default: Date.now()},
    user_id: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true}
});

module.exports = mongoose.model('Picture', pictureSchema);