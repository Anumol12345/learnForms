const getDb = require('../util/db').getDb;
var ObjectId = require('mongodb').ObjectId; 


exports.select =function() {
  const db = getDb();
  // db.createCollection("home_data");
  return  db.collection("home_data").find({}).toArray();
}
exports.selectAll =function() {
  const db = getDb();
  //db.createCollection("home_urls");
  return  db.collection("home_urls").find({}).toArray();
}
exports.SelectProfile = ()=> {
  const db = getDb();
  // db.createCollection("home_data");
  return  db.collection("profile_data").find({ role: 'Reviewer' }).toArray();
   // return db.execute('SELECT * FROM profile_data WHERE role ="Reviewer"');
}
exports.SelectRevProfile = (id)=> {
  const db = getDb();
  // db.createCollection("home_data")
  return  db.collection("profile_data").find({ "_id":  ObjectId(id) }).toArray();
  //return db.execute('SELECT * FROM profile_data WHERE id ="'+id+'"');
}
exports.SelectProfileLink =(email)=> {
  const db = getDb();
  // db.createCollection("home_data");
  return  db.collection("profile_links").find({ email: email }).toArray();
  //return db.execute('SELECT * FROM profile_links WHERE email ="'+email+'"');
}
