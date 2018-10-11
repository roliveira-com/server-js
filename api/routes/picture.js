
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Picture = require('../models/picture')

router.get('/', (req, res, next) => {
    Picture.find()
    .populate('user_id')
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        error: err
        });
    });
})

router.post('/:userid', (req, res, next) => {
    const pic = 
    new Picture({
        _id: new mongoose.Types.ObjectId(),
        file_name: req.body.filename,
        file_url: req.body.fileurl,
        is_avatar: req.body.isavatar || false,
        user_id: req.params.userid
    });
    pic.save()
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})

router.delete('/:id', (req, res, next) => {
    Picture.remove({_id:req.params.id})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})

router.patch('/:id', (req, res, next) => {
    const updates = {};
    for(const prop of req.body){ updates[prop.propName] = prop.value }
    Picture.update({_id:req.params.id},{$set:updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})

module.exports = router;
