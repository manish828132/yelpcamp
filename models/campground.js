const mongoose=require('mongoose')

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
    }
})


const Campground=mongoose.model('Campground',campgroundSchema)


module.exports=Campground;