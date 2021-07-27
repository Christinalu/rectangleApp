var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId; 
const Rectangle = require('../models/rectangle')

/* GET all rectangles. */
router.get('/all', async (req, res, next) => {
  await res.app.locals.db.collection('rectangle').find({}).toArray((err, result) => {
    if (err){
      console.error(err)
    }
    if(result === undefined || result.length === 0){
      console.error('No Rectangle in database')
    } else {
      res.send(result)
      console.log('Found all rectangles')
    }
  })
})

/* GET rectangle by id */
router.get('/get/:id', async (req, res, next) => {
  var Object_id = new ObjectId(req.params.id)
  console.log(`${req.params.id}`);
  req.app.locals.db.collection('rectangle').findOne({
     _id : Object_id
    }, (err, result) => {
    if(err){
      console.error(err)
    }
    if (result === undefined){
      console.error('No rectangle matching that id was found')
      console.log(`${result}`);
    } else {
      res.send(result[0])
      console.log(`Found rectangle ${result}`)
    }
  })
})

/* Create a new Rectangle */
router.post('/new', async (req, res, next) => {
  console.log('Adding new rectangle');
  const maxId = await req.app.locals.db.collection('rectangle').find()
        .sort({ ID: -1 })
        .limit(1); // returns array
  const newId = +maxId[0].ID + 1;
  const newRectangle = new Rectangle(newId, req.body.width, req.body.height, req.body.color
    , req.body.name)
  req.app.locals.db.collection('rectangle').insertOne({
    newRectangle
  }, (err, result) => {
    if(err) throw err
    res.json(result)
    console.log('Created new rectangle')
  })
})

/* Delete a Rectangle with existing id */
router.delete('/delete/:id', async (req, res, next) => {
  req.app.locals.db.collection('rectangle').deleteOne({
    _id : req.params.id
  }, (err, result) => {
    if(err) throw err
    res.statu(200).send(result)
    console.log('Delete corresponding rectangle')
  })
})

/* Change attributes of any of the rectangles */
router.patch('/update/:id', async (req, res, next) => {
  req.app.locals.db.collection('rectangle').updateOne({
    _id: req.params.id
  },
  {$set:
    {
      width: req.body.width,
      height: req.body.height,
      color: req.body.color,
      name: req.body.name
    }
  }, (err, result) => {
      if (err) throw err
      res.status(200).send(result)
      console.log('Sucessfully changed field') 
    })
})

module.exports = router;
