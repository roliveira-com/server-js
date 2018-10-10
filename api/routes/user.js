
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user')

router.get('/', (req, res, next) => {
    User.find()
    .exec()
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

router.post('/', (req, res, next) => {
    const user = 
    new User({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        email: req.body.email,
        senha: req.body.senha,
    });
    user.save()
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})

router.delete('/:id', (req, res, next) => {
    User.remove({_id:req.params.id})
        .exec()
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
    User.update({_id:req.params.id},{$set:updates})
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})

module.exports = router;
