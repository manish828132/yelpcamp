const express =require('express')
const path =require('path')
const methodOverride=require('method-override')
const mongoose=require('mongoose')
const ejsMATE=require('ejs-mate');
const Campground=require('./models/campground')
const seedCampgrounds=require('./seed')
const AppError=require('./AppError');


const app=express();

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'))
app.engine('ejs', ejsMATE);


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp-project', {
    
}).then(function(){
    console.log('connect to mongodb')
}).catch(function(err){
    console.log('not connected mongodb');
    
});



app.get('/home',(req,res)=>{
    
    res.render('home');
})

app.get('/campground',async (req,res)=>{
    
    const campgrounds=await Campground.find({})
    
        res.render('campground/home',{campgrounds})
       
    
    

   
    // await Campground.insertMany(seedCampgrounds)
    // res.send("ok")
})

app.get('/campground/:id',async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById({_id:id});
    if(campground){
    res.render('campground/show',{campground});}
    else{
        throw new AppError("product not found",404);
    }
     
})

app.get('/create',(req,res)=>{
    res.render('campground/create');
})
app.get('/campgrounds/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const findCamp=await Campground.findById(id)
    
    res.render('campground/edit',{findCamp});
})
app.patch('/campgrounds/:id/update',async (req,res)=>{
    const {id}=req.params;
    const updateCamp=await Campground.findByIdAndUpdate(id, req.body, {
        new: true,       // return the updated document
        runValidators: true // ensures Mongoose validators run
      });
      res.redirect(`/campground/${updateCamp._id}`)
})

app.post('/create',async (req,res)=>{
    const {title,description,location,price,image}=req.body;
    const newCamp=new Campground({title:title,
        description:description,
        location:location,
        price:price,
        image:image
    })
    const saveCamp=await newCamp.save();
    res.redirect('/campground')
})

app.delete('/delete/:id',async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
    

})

app.use((err,req,res,next)=>{
    const{status=500,message="error!!!!!!!!!!!1"}=err;
    res.status(status).send(message);
})


app.listen('3000',function(){
    console.log('server started')
})