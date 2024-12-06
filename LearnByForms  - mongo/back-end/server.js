const express = require('express');
const bodyParser = require("body-parser");
var session = require('express-session');
const multer = require('multer');
 const login = require("./routes/login");
 const home = require("./routes/home");
 const app = express();

 //const mongoConnect = require('./util/database');

 app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: false,
  rolling: true,
  //cookie:{maxAge:500 }
}));
// const storage = multer.diskStorage({
//   destination: (req, file, callBack) => {
//       callBack(null, 'images')
//   },
//   filename: (req, file, callBack) => {
//       callBack(null, file.originalname)
//   }
// })

// var upload = multer({storage: storage});
app.use(express.static('images'));

//app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));

 app.use('/api/home' , home);
 app.use('/api/login' , login);

//  app.use('/api/login/addProfile', upload.single('file'), function(req, res, next) {
//   //console.log(req);
//   //if(!req.file) {
//       //return res.status(500).send({ message: 'Upload fail'});
//   //} else {
//      console.log(req.file);
     
//   //}
// });

 const mongoConnect = require('./util/db').mongoConnect;
 mongoConnect(() => {
  app.listen(3080);
  console.log("Server started in port 3080!");
});


//  app.listen(3080, () => {
//     console.log("Server started in port 3080!");
//   });


  