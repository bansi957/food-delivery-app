// const multer=require('multer');
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'./public')
//     },

//     filename:function(req,file,cb){
//         cb(null,Date.now()+'-'+file.originalname)
//     }

// });

// module.exports=multer({storage});

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "/tmp"; // ALWAYS exists on Render

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = multer({ storage });
