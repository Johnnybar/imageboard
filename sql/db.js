// REQUIRE AND SET UP SPICEDPG
const spicedPg = require("spiced-pg");
const secret = require("../secrets.json");
const s3 = require("../config.json");

const user = secret.username;
const pass = secret.password;
var db = spicedPg(`postgres:${user}:${pass}psql@localhost:5432/imageboard`);

exports.getImageUrls = function() {
    return db.query(
        `SELECT * FROM images`
    ).then((results) => {
        results.rows.forEach(elem => {
            elem.image = s3.s3Url + elem.image;
        });
        return results.rows;
    }).catch((err) => {
        console.log(err);
    });
};


exports.insertImages = function(image, username, title, description) {
    return db.query(
        'INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id',
        [image, username, title, description]
    ).then((results) => {
        return results.rows[0].id;
    }).catch((err) => {
        console.log(err);
    });
};

exports.getImageById = function(id){
    return db.query(
        `SELECT * from images where id = $1`, [id])
        .then((results)=>{
            return results.rows;
        });

};

exports.insertComments = function(username, comment, imageId) {
    return db.query(
        'INSERT INTO comments (username, comment, imageId) VALUES ($1, $2, $3)',
        [username, comment, imageId]
    ).then((results) => {
        return results.rows[0];
    }).catch((err) => {
        console.log(err);
    });
};

exports.getComments = function(imageId) {
    return db.query(`SELECT * from COMMENTS
    where imageId = $1
    ORDER BY created_at DESC`,
        [imageId])
        .then(function(results) {
            return results.rows;
        }).catch(function(err) {
            console.log(err);
        });
};
