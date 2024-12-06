const ModelData = require('../model/login');
const tokenData = require('./token');
//var crypto = require('crypto');
// var generate_key = function() {
//     return crypto.randomBytes(4).toString('dec');
//    //return (Math.floor(100000 + Math.random() * 900000))
// };
const imageUrl = 'http://localhost:3080/';
const axios = require('axios');
const  {google}  = require('googleapis');
  const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URL = "http://localhost:4200/login"

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;


exports.login = async(req, res, next) => {
    const sendData =JSON.parse(req.body.inputObjs)[0];
    console.log(req.body.id);
    const email =sendData.email
    const password =sendData.password
    
    const loginModel = new ModelData(null ,email,null);
    const usersign =await loginModel.SelectUser();
    console.log(usersign)

    if(!usersign[0]){
        res.send({error : "The User does not existed"}) 
    }
    else{
      if(usersign[0].password == password){

        const token =tokenData.createToken(email);
        console.log(token);

       
       
       const prof_data = await new ModelData().SelectProfile(email);
       var name ='';
       if(prof_data[0]){
          name = prof_data[0].name;
          await new ModelData().UpdateUser(name,email);

       }
       else{
        name =usersign[0].name;
       }
       var session = req.session;
       session.sessionkey  = token;
       session.userid  = usersign[0].email;
       session.name  = name;
       if(prof_data[0]){
        if(prof_data[0].image){
        session.userimg = prof_data[0].image
        }
       }
      
       console.log(session);
      
      
       await new ModelData().SaveSession(session.userid ,session.sessionkey );

       const resultobj={
        sessionkey :session.sessionkey,
        userid :session.userid,
        name:session.name,
        profileImage : session.userimg
        }
    
       console.log(resultobj);
       res.send(resultobj) ;
      }
      else{
        res.send({error : "Incorrect password , Please try again"})
      }
    }
};;
exports.register = async(req, res, next) => {
    const sendData =JSON.parse(req.body.inputObjs)[0];
    console.log(req.body.id);
    const name =sendData.userid
    const email =sendData.email
    const password =sendData.password

    const RegModel = new ModelData(name ,email,password);

    const useremail =await RegModel.SelectUser();
    
    console.log(useremail);
    if(useremail[0]){
        res.send({error : "The User already existed"}) 
    }
    else{
        const result =await RegModel.SaveUser(); 
        if(result){
          const token =tokenData.createToken(email);
          console.log(token);

  
          var session = req.session;
            session.sessionkey  = token;
            session.userid  = email;
            session.name  = name;
            console.log(session);

             await new ModelData().SaveSession(session.userid ,session.sessionkey )
           
             const resultobj={
                 sessionkey :session.sessionkey,
                 userid :session.userid,
                 name:session.name,
              }
            console.log(resultobj);
            res.send(resultobj) ;
         }
         if(!result){
            res.send({error : "Something wrong"})
         }
    }
};;

exports.logout = async(req, res, next) => {
     const email = req.body.userid;
      authed = false;
      req.session.destroy();
      await new ModelData().DeleteSession(email)
      console.log(req.session);
  
      res.send({result :"success"});
    
    
};;


exports.auth = async(req, res, next) => {
    if (!authed) {
      // Generate an OAuth URL and redirect there
      const url = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: ['https://www.googleapis.com/auth/gmail.readonly',
              'https://www.googleapis.com/auth/userinfo.profile',
              'https://www.googleapis.com/auth/userinfo.email']
        });
      console.log(url)
      res.send({url:url});
     } else {
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      gmail.users.labels.list({
          userId: 'me',
      }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const labels = res.data.labels;
          if (labels.length) {
              console.log('Labels:');
              labels.forEach((label) => {
                  console.log(`- ${label.name}`);
              });
          } else {
              console.log('No labels found.');
          }
      });
      res.send('Logged in')
  }
};;

exports.callback = async(req, res, next) => {
    const sendData =JSON.parse(req.body.inputObjs)[0];
    console.log(req.body.id);
    const code = sendData.Code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                authed = true;
                
                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
                  {
                    headers: {
                      Authorization: `Bearer ${tokens.id_token}`,
                    },
                  }
                )
                .then(async function(result) {
                    console.log(result.data);
                    const email = result.data.email;
                    const loginModel = new ModelData(null ,email,null);
                    const usersign =await loginModel.SelectUser();

                    if(usersign[0]){
                      const token =tokenData.createToken(email);
                        console.log(token);  
                     
                     
                        const prof_data = await new ModelData().SelectProfile(email);
                        var name ='';
                        if(prof_data[0]){
                           name = prof_data[0].name;
                           await new ModelData().UpdateUser(name,email);
                 
                        }
                        else{
                         name =usersign[0].name;
                        }
                        var session = req.session;
                        session.sessionkey  = token;
                        session.userid  = usersign[0].email;
                        session.name  = name;
                        if(prof_data[0]){
                          if(prof_data[0].image){
                          session.userimg = prof_data[0].image
                          }
                         }
                       
                        console.log(session);
                       
                       
                        await new ModelData().SaveSession(session.userid ,session.sessionkey );
                 
                        const resultobj={
                          sessionkey :session.sessionkey,
                          userid :session.userid,
                          name:session.name,
                          profileImage : session.userimg
                       }
                      
                        console.log(resultobj);
                        res.send(resultobj) ;
                    }
                    else{
                      const name = result.data.name;
                      const email = result.data.email;
                      const RegModel = new ModelData(name ,email,null);
                      console.log(result.data);
                      const result1 =await RegModel.SaveUser(); 
                      if(result1){

                        const token =tokenData.createToken(email);
                        console.log(token);
                
                        var session = req.session;
                        session.sessionkey  = token;
                        session.userid  = email;
                        session.name  = name;
                        console.log(session);
                        await new ModelData().SaveSession(session.userid ,session.sessionkey )
                       
                         
                       const resultobj={
                           sessionkey :session.sessionkey,
                           userid :session.userid,
                           name:session.name,
                           
                        }
                        console.log(resultobj);
                        res.send(resultobj) ;
                     }
                     if(!result1){
                        res.send({error : "Something wrong"})
                     }
                    }

                })
                .catch(error => {
                  throw new Error(error.message);
                });
               
                
            }
        });
    }
};;
exports.profile = async(req,res,next)=>{
  console.log(req.session);
  const token =req.body.sessionKey;
  const email =req.body.userid
 

  if (!token) {
		return res.status(401).end()
	}
try{
  const payload = tokenData.verifyToken(token);
  console.log(payload);

 const prof_data = await new ModelData().SelectProfile(email);

 //const ProfileLink = await new ModelData().SelectProfileLink(email);
 console.log(prof_data);
 //console.log(ProfileLink);

  res.send({profile:prof_data} );
 
 
}
catch(e){
  console.log(e.name);
   if(e.name == 'TokenExpiredError'){
   //const newToken = tokenData.renewToken(email);

   res.send({error:'TokenExpired'})
   }

}
	//res.send({userId:payload.email});
}

exports.addProfile = async(req,res,next)=>{
  //const token =req.body.sessionKey;
  console.log(req.file);
  //console.log(req.body);
  const val = JSON.parse(JSON.stringify(req.body));
  console.log(val);

  const sendData =JSON.parse(val.formvalues);
  const DataAr =JSON.parse(val.dataArr);
  console.log(DataAr);
  
  const linkData = DataAr[0];
  const projData = DataAr[1];
  const collabData = DataAr[2];

  const token =val.sessionkey;

  var image ;
  const email =sendData.email;
  const name = sendData.name;
  const username = sendData.username;
  const location =sendData.location;
  const role = sendData.roles;
  const about =sendData.about;
  image = sendData.uploadedImage;
  const profDesc =sendData.profDesc;
  const setcollab= sendData.setcollab;
  const setlink= sendData.setlink;
  const setproj= sendData.setproj;
  //console.log(image);
if(req.file){
   image = imageUrl + req.file.filename;
  console.log(image);
}
  
  
   if (!token) {
	 	return res.status(401).end()
	 }
try{
  const payload = tokenData.verifyToken(token);
  console.log(payload);

  const Isuser = await new ModelData().SelectProfiles(username);
  console.log(username);
  
  if(Isuser[0]){
    if(Isuser[0].email == email) {
      await new ModelData().UpdateProfile(name,username ,email,location ,role,about,profDesc,image,setcollab,setlink ,setproj ,linkData,projData,collabData);
      const Profile = await new ModelData().SelectProfile(email);
      res.send(Profile[0]);
      //res.redirect('/api/login/profile')
    }
    else{
      res.send({Usererror:'Username already existed'});
    }
    
  }
  else{
    const IsProfile = await new ModelData().SelectProfile(email);
 
    if(IsProfile[0]){
      console.log(" existed")
      await new ModelData().UpdateProfile(name,username ,email,location ,role,about,profDesc,image,setcollab,setlink ,setproj,linkData,projData,collabData);
    }
    else{
      console.log("not exist")
      await new ModelData().SaveProfile(name,username ,email,location ,role,about,profDesc,image,setcollab,setlink ,setproj,linkData,projData,collabData);
    }
    const Profile1 = await new ModelData().SelectProfile(email);
    res.send(Profile1[0]);
    //res.send(Isuser[0]);
    //res.redirect('/api/login/profile')
  // res.send({result:'profile updated'});
  }
  
}
catch(e){
  console.log(e);
  if(e.name == 'TokenExpiredError'){
  //const newToken = tokenData.renewToken(email);

  res.send({error:'TokenExpired'})
  }

}
//	res.send({userId:payload.email});
}
   