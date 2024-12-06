const ModelData = require('../model/home');

exports.home = async(req, res, next) => {
       const home_data =await ModelData.select();
       console.log(home_data);
        res.send(home_data)
   };;
exports.homedata = async(req, res, next) => {
  
     const home_url =await ModelData.selectAll();
     console.log(home_url);
      res.send(home_url);
 };;
 exports.reviewdata = async(req, res, next) => {
  
     const home_data1 =await ModelData.SelectProfile();
     console.log(home_data1);
     res.send(home_data1)
 };;
 exports.reviewData = async(req, res, next) => {
     const sendData =JSON.parse(req.body.inputObjs)[0];
     
     const home_data1 =await ModelData.SelectRevProfile(sendData.id);
     //var IsProfileLink=[];
    // if(home_data1[0]){
       //  IsProfileLink = await  ModelData.SelectProfileLink(home_data1[0].email);
     //}
     
     console.log(home_data1);
     //console.log(IsProfileLink);
     res.send({profile:home_data1})
    
      
 };;