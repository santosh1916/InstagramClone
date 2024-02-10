const profileStroage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null, '.public/images/uploads/profile')
    },
    filename:function(req,file,cb){
      const unique = uuidv4();
      cb(null , unique+path.extname(file.originalname))
    }
  });
  
  const updateProfile = multer({profileStroage:profileStroage});
  module.exports = updateProfile;