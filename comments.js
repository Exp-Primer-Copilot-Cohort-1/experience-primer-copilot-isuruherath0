//create web server
var express = require('express');
var router = express.Router();
var fs = require('fs');

//create database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
//create schema
var commentSchema = mongoose.Schema({
    Name: String,
    Comment: String,
    Date: String
});
//create model
var Comment = mongoose.model('Comment', commentSchema);
//get data from database
var commentData = [];
db.once('open', function() {
    Comment.find(function(err, comment) {
        if (err) return console.error(err);
        commentData = comment;
    });
});
//create router
router.get('/', function(req, res) {
    res.send(commentData);
});
router.post('/', function(req, res) {
    var comment = new Comment({
        Name: req.body.Name,
        Comment: req.body.Comment,
        Date: req.body.Date
    });
    comment.save(function(err, comment) {
        if (err) return console.error(err);
        commentData.push(comment);
        res.send(commentData);
    });
});
router.delete('/', function(req, res) {
    var id = req.body.id;
    Comment.remove({ _id: id }, function(err) {
        if (err) return console.error(err);
        for (var i = 0; i < commentData.length; i++) {
            if (commentData[i]._id == id) {
                commentData.splice(i, 1);
            }
        }
        res.send(commentData);
    });
});
router.put('/', function(req, res) {
    var id = req.body.id;
    Comment.findOne({ _id: id }, function(err, comment) {
        if (err) return console.error(err);
        comment.Name = req.body.Name;
        comment.Comment = req.body.Comment;
        comment.Date = req.body.Date;
        comment.save(function(err, comment) {
            if (err) return console.error(err);
            for (var i = 0; i < commentData.length; i++) {
                if (commentData[i]._id == id) {
                    commentData[i] = comment;
                }
            }
            res.send(commentData);
        });
    });
});
module.exports = router;