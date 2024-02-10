var express = require('express');
var router = express.Router();
const passport = require('passport');
const localStratergy = require('passport-local');


const userModel = require('../models/user');
const multerConfig = require('../models/multerConfig');
const postModel = require('../models/post');

// middleWare
passport.use(new localStratergy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/home',isLoggedIn, async function(req, res, next) {
  try {
    const allpost = await postModel.find().populate('user comments.user');
    const myUserData = await userModel.findOne({username:req.session.passport.user})
    res.render('home' ,{myUserData, allpost});
  } catch (error) {
    console.log(error)
    res.send(500).send("Server Internal error 500:")
  }
});
router.get('/profile', isLoggedIn, async function(req,res){
  const myUserData = await userModel.findOne({username:req.session.passport.user}).populate('posts')
  res.render('profile', {myUserData})
})
router.get('/create', isLoggedIn, async function(req,res){
  const myUserData = await userModel.findOne({username:req.session.passport.user})
  res.render('create', {myUserData});
});

// logout
router.get('/logout' , function(req,res){
  req.logout(function(err){
    if(err){return next(err)}
    res.redirect('/login')
  });
})


// Add comment here
router.post('/addComment/posts/:id', async (req, res) => {
  try {
    const myUser = await userModel.findOne({ username: req.session.passport.user });

    if (!myUser) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    const myPost = await postModel.findOne({ _id: req.params.id }).populate('comments');

    if (!myPost) {
      console.log('Post not found');
      return res.status(404).send('Post not found');
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          comments: {
            user: myUser._id,
            text: req.body.comment,
          },
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      console.log('Post not found after update');
      return res.status(404).send('Post not found after update');
    }

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// liked here 

// Create post here
router.post('/create', multerConfig.upload.single('fileInput') ,async (req,res)=>{
  const myUser = await userModel.findOne({username:req.session.passport.user});
  const createPost = await postModel.create({
    user:myUser._id,
    caption:req.body.caption,
    description:req.body.descriptions,
    filename:req.file.filename,
  });
  await myUser.posts.push(createPost._id);
  myUser.save();
  res.redirect('/profile');
})



// Update user detials
  router.post('/update', multerConfig.updateProfile.single('userProfile'), async function (req, res) {
    const updateFields = {};

    if (req.body.username) {
        updateFields.username = req.body.username;
    }

    if (req.body.fullname) {
        updateFields.fullname = req.body.fullname;
    }

    if (req.body.userbio) {
        updateFields.userbio = req.body.userbio;
    }

    if (req.file) {
        updateFields.profileimage = req.file.filename;
    }

    try {
      const myUser = await userModel.findOneAndUpdate(
          { username: req.session.passport.user },
          updateFields,
          { new: true }
      );
      await myUser.save();
      res.redirect('/profile');
  } catch (error) {
      // Handle error, e.g., send an error message to the user
      console.error(error);
      res.redirect('/profile'); // Redirect to profile page even if there's an error
  }
})

// Example: Register a new user
router.post('/register' , function(req,res){
    try {
      // Your registration logic here
      const newUser = new userModel({
        fullname:req.body.fullname,
        username:req.body.username,
        email:req.body.email
        });
        userModel.register(newUser , req.body.password)
        .then(function(){
          passport.authenticate("local")(req,res , function(){
            res.redirect('/home');
          })
        })
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  })


  // login
  router.post('/login', passport.authenticate("local",{
    successRedirect : "/home",
    failureRedirect:"/",
    failureFlash:true
    }), function(req,res){
  });

//  isLoggedIn
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/");
  }
}


module.exports = router;
