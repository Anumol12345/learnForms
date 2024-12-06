
const getDb = require('../util/db').getDb;

module.exports = class ModelData {
    constructor(name ,email, password) {
       
     this.name = name;
     this.email = email;
     this.password = password;
    }
    
  SelectUser() {
    const db = getDb();
   //db.createCollection("user_data")
   var query = { email: this.email };
  return  db.collection("user_data").find(query).toArray();
  }
  SaveUser() {
    const db = getDb();
      var myobj = {name:this.name , email:this.email ,password:this.password}
     return db.collection("user_data").insertOne(myobj);
  }
  UpdateUser(name , email){
    const db = getDb();
      var myquery = { email: email };
      var newvalues = { $set: {name :name } };
      return db.collection("user_data").updateOne(myquery, newvalues);
  }


  SelectSession(userid){
    const db = getDb();
    //db.createCollection("session_data")
    var query = { userid: userid };
   return  db.collection("session_data").find(query).toArray();
  }
  SaveSession(userid , sessionkey){
    const db = getDb();
  var myobj = {userid:userid , sessionkey:sessionkey }
 return db.collection("session_data").insertOne(myobj);
      
  }
  DeleteSession(email){
    const db = getDb();
    var myquery = { userid: email };
  db.collection("session_data").deleteOne(myquery);
  }


  SelectProfiles(username) {
    const db = getDb();
    //db.createCollection("profile_data")
    var query = { username: username };
   return  db.collection("profile_data").find(query).toArray();
  }
  SelectProfile(email) {
    const db = getDb();
    //db.createCollection("profile_data")
    var query = { email: email };
   return  db.collection("profile_data").find(query).toArray();
  }
  SaveProfile(name,username ,email,location ,role,about,profDesc,image,setcollab,setlink ,setproj,linkData,projData,collabData){
    const db = getDb();
  var myobj = {name:name ,username:username , email:email ,location:location ,role:role ,about:about,profileDesc :profDesc,setcollab:setcollab,setlink:setlink ,setproj:setproj, image:image , links:linkData , projects:projData , Collabs :collabData }
 return db.collection("profile_data").insertOne(myobj);
  }
  UpdateProfile(name,username ,email,location ,role,about,profDesc,image,setcollab,setlink ,setproj,linkData,projData,collabData){
      const db = getDb();
      var myquery = { email: email };
      var newvalues = { $set: {name:name ,username:username , email :email , location :location, role :role,about :about ,profileDesc :profDesc,setcollab:setcollab,setlink:setlink ,setproj:setproj,image:image, links:linkData , projects:projData , Collabs :collabData } };
      return db.collection("profile_data").updateOne(myquery, newvalues);
     }
    

//   SelectProfileLink(email) {
//     const db = getDb();
//     //db.createCollection("profile_data")
//     var query = { email: email };
//    return  db.collection("profile_links").find(query).toArray();
//   }
//   SaveProfileLink(email,links){
//     const db = getDb();
//     console.log(links[0]);
//   var myobj = {email:email , links:links}
//  return db.collection("profile_links").insertOne(myobj);
//   }
//   UpdateProfileLink(email,links){
//     const db = getDb();
//       var myquery = { email: email };
//       var newvalues = { $set: {links :links } };
//       return db.collection("profile_links").updateOne(myquery, newvalues);
// }
}
