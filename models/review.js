const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
});

const Review=mongoose.model('Review',reviewSchema);

module.exports=Review;