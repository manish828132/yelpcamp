const mongoose=require('mongoose');
const Review = require('./review');

const campgroundSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    review:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:Review
        }
    ]
        
    
});

campgroundSchema.post('findOneAndDelete',async (camp)=>{
    if(camp.review.length){
        await Review.deleteMany({_id:{$in:camp.review}})
    }
})


const Campground=mongoose.model('Campground',campgroundSchema)


module.exports=Campground;