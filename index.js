const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const s3 = require('./s3');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const db = require("./sql/db.js");


//________CNFG MULTER

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//_________MIDDLEWARE


app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//__________REQUESTS


app.post('/upload', uploader.single('file'), function(req,res,next){
    if(req.file){
        s3.upload(req.file).then(function(){
            return db.insertImages(req.file.filename, req.body.user, req.body.title, req.body.desc);
            // next();
        }).then(function(){
            res.json({ success:true });
        }).catch(function(){
            res.json({ success:false });
        });
    }
});

app.get('/singleImg/:id', (req,res)=>{
    const id = req.params.id;
    db.getImageById(id)
        .then((results)=>{
            res.json(results);
        }).catch((err)=>{
            console.log(err);
        });
});

app.post('/comment/:imageId',(req,res)=>{
    var id = req.params.imageId;
    console.log('comment Id is: ', id);

    var username= req.body.username;
    var comment = req.body.comment;

    db.insertComments(username, comment, id)
        .then(()=>{
        }).then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            console.log(err);
        });
});


app.get('/comment/:imageId',(req,res)=>{
    var id = req.params.imageId;

    db.getComments(id)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            console.log(err);
        });
});

app.get('/images', (req, res) => {
    db.getImageUrls().then(results => {
        res.json(results);
    });
});

app.get('*', (req,res)=>{
    res.sendFile(__dirname+ '/public/views/index.html');
});


//__________LISTEN
app.listen(process.env.PORT || 8080, ()=> (console.log('listening on port 8080')));
