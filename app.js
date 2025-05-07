const express =require('express')
const path =require('path')
const methodOverride=require('method-override')
const mongoose=require('mongoose')
const ejsMATE=require('ejs-mate');
const Campground=require('./models/campground')
const seedCampgrounds=require('./seed')
const AppError=require('./utils/AppError');
const validateCampground=require('./utils/campgroundValidationSchema')
const Review=require('./models/review')
const validateReview=require('./utils/reviewValidationSchema');
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport');
const localStrategy=require('passport-local').Strategy;
const User=require('./models/user')

const app=express();


//*******************************************************************

app.use(session({
    secret:'thisismysecret',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:1000*60*60*24*7}
}));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* **************************************************************** */

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

app.use((req,res,next)=>{
    res.locals.message=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/home',(req,res)=>{
    
    res.render('home');
})

app.get('/campground',async (req,res)=>{
    
    const campgrounds=await Campground.find({})
    
        res.render('campground/home',{campgrounds})
       
    
    

   
    
})


//*********************************************************************



app.get('/campground/:cam_id/review/:rev_id/edit',async (req,res)=>{
    const {rev_id,cam_id}=req.params;
   const review=await Review.findById(rev_id);
   
    res.render('review/edit',{rev_id,cam_id,text:review.text,rating:review.rating})

})

app.get('/campground/review/:id',async (req,res)=>{
    const {id}=req.params;

    res.render('review/review',{id});
})

app.patch('/campground/:cam_id/review/:rev_id/edit',validateReview,async (req,res)=>{
    const{cam_id,rev_id}=req.params;
    const {text,rating}=req.body;
    const update=await Review.findByIdAndUpdate(rev_id, req.body, {
        new: true,       // return the updated document
        runValidators: true // ensures Mongoose validators run
      });
      res.redirect(`/campground/${cam_id}`);
    //res.send(cam_id+rev_id+text+rating);

})

app.post('/campground/review/:id',validateReview,async (req,res)=>{
    const {text,rating}=req.body;
    const {id}=req.params;
    const camp=await Campground.findById({_id:id});
    const newReview=new Review({text,
        rating});
    camp.review.push(newReview);
    await newReview.save();  
    await camp.save();  
    res.redirect(`/campground/${id}`)
})

app.delete('/campgrounds/:campground_id/review/:review_id/delete',async (req,res)=>{
    const {campground_id,review_id}=req.params;
    await Campground.findByIdAndUpdate(campground_id,{$pull:{review:review_id}});
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/campground/${campground_id}`);
})



//************************************************************** *





app.get('/campground/:id',async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById({_id:id}).populate('review');
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
});








app.patch('/campgrounds/:id/update',validateCampground,async (req,res)=>{
    const {id}=req.params;
    const updateCamp=await Campground.findByIdAndUpdate(id, req.body, {
        new: true,       // return the updated document
        runValidators: true // ensures Mongoose validators run
      });
      res.redirect(`/campground/${updateCamp._id}`)
})

app.post('/create',validateCampground,async (req,res)=>{
    const {title,description,location,price,image}=req.body;
    const newCamp=new Campground({title:title,
        description:description,
        location:location,
        price:price,
        image:image
    })
    const saveCamp=await newCamp.save();
    if(saveCamp){
        req.flash('success','successfully created');
    }
    else
    {
        req.flash('error','something went wrong');
    }
    res.redirect('/campground')
})

app.delete('/delete/:id',async (req,res)=>{
    const {id}=req.params;
    const deleteCamp=await Campground.findByIdAndDelete(id);
    if(deleteCamp){
        req.flash('success','successfully deleted');
    }
    else
    {
        req.flash('error','something went wrong');
    }
    res.redirect('/campground');
    

})


// app.use((err,req,res,next)=>{
//     console.log(err.name);
//     next(err);
// })

app.all(/(.*)/, (req, res, next) => {
    next(new AppError('Page not found', 404));
});



app.use((err,req,res,next)=>{
    const {status=500,message="error!!!!!!!!!!!"}=err;
    res.status(status).render('error',{err});
    //res.render('error')
    //res.send(`${err.name} ${err.message}`)
})


app.listen('3000',function(){
    console.log('server started')
})



// notes:
// Ah, yes — you're totally right, and great point to bring up.

// As of Express v5 (currently in beta but widely used), async errors are handled automatically, meaning you no longer need to manually wrap route handlers in try/catch or use custom asyncHandler wrappers like you did in Express v4.