var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var conn = mongoose.connection; 
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo; 

// var fs = require('fs');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/images', function (req, res) {
    var gfs = Grid(conn.db);
    gfs.collection('images');
    gfs.files.find().toArray(function (err, files) {
        if (err) throw (err);
        res.json(files);
    })
})

router.get('/images/:objectId', function (req, res) {
    // TODO: set proper mime type + filename, handle errors, etc...
    var options = {
        _id : req.params.objectId,
        root: 'images'
    };
    // create a read stream from gfs...
    var gfs = Grid(conn.db);
    //res.writeHead(200, { "Content-Type" : "image/png"});

    gfs.exist(options, function (err, found) {
        if (err) return;
        if (found) {
            gfs.createReadStream(options)
            // and pipe it to Express' response
            .pipe(res);
        }
    })
    // gfs.createReadStream(options)
    // // and pipe it to Express' response
    // .pipe(res);
});  

router.delete('/images/:objectId', function (req, res) {
    var gfs = Grid(conn.db);
    gfs.remove({
        _id: req.params.objectId,
        root: 'images'
    }, function (err) {
        if (err) return;
        gfs.files.find().toArray(function (err, files) {
        if (err) throw (err);
        res.json(files);
        })
    })
})

router.post('/file-upload', function (req, res, next) {
    var title
    req.pipe(req.busboy);
    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
        title = value;
    });
    req.busboy.on('file', function (fieldname, file, filename) {
        // console.log("Uploading: " + filename); 
        // conn.once('open', function() {
            if (title === null || title.length === 0)
                title = filename;
            var gfs = Grid(conn.db);
            var writestream = gfs.createWriteStream({
                filename: filename,
                content_type: file.mimetype,
                root: "images",
                metadata: {
                    title: title
                }
            });
            //fstream = fs.createWriteStream(__dirname + '/tmp/' + filename);
            file.pipe(writestream);         
            writestream.on('close', function () {
                res.redirect('/');
            });
            // fstream.on('close', function () {
            //     res.redirect('back');
            // });
          // });
    });
});


module.exports = router;
