// Require and set up spicedPg
const s3 = require("../config.json");
var spicedPg = require('spiced-pg');
let dbUrl;
const fetch = require('node-fetch');

let userInfo = {
  username: 'user',
  password: 'pass'
}


if (process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
} else {
  // var userInfo = require('../secrets.json');
  var user = userInfo.username;
  var pass = userInfo.password;
  // dbUrl = `postgres:${user}:${pass}psql@localhost:5432/imageboard`;
}
// var db = spicedPg(dbUrl);

exports.getImageUrls = function() {
   return fetch('https://randomuser.me/api/?results=20').then((results) => {
     
    // results.rows.forEach(elem => {
    //   elem.image = s3.s3Url + elem.image;
    // });
    // return results.rows;
    return results.text()
  }).catch((err) => {
    console.log(err);
  });
};

exports.insertImages = function(image, username, title, description) {
  return db.query('INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id', [image, username, title, description]).then((results) => {
    return results.rows[0].id;
  }).catch((err) => {
    console.log(err);
  });
};

// exports.getImageById = function(id, index) {

//         // results.rows.forEach(elem => {
//         //   elem.image = s3.s3Url + elem.image;
//         // });
//         // return results.rows;
//     
//   // return db.query(`SELECT * from images where id = $1`, [id]).then((results) => {
//   //   return results.rows;
//   });

// };

exports.insertComments = function(username, comment, imageId) {
  return db.query('INSERT INTO comments (username, comment, imageId) VALUES ($1, $2, $3)', [username, comment, imageId]).then((results) => {
    return results.rows[0];
  }).catch((err) => {
    console.log(err);
  });
};

exports.getComments = function(imageId) {
  return db.query(`SELECT * from COMMENTS
    where imageId = $1
    ORDER BY created_at DESC`, [imageId]).then(function(results) {
    return results.rows;
  }).catch(function(err) {
    console.log(err);
  });
};
