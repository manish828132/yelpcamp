const mongoose=require('mongoose')
const User=require('./user');
const reviewSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
});

const Review=mongoose.model('Review',reviewSchema);

module.exports=Review;