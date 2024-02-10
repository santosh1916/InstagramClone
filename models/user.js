const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/instagramclone");

const userSchema = mongoose.Schema({
    fullname:{
        type:String, 
        require:true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
    },
    profileimage:{
        type:String,
        default:"default dp.png"
    },
    userbio:{
        type:String
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    saved:{
        type:Array,
        default:[]
    },
    likes:{
        type:Array,
        default:[]
    }
})

userSchema.plugin(plm);

module.exports = mongoose.model('User' , userSchema);