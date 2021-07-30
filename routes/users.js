const axios = require('axios');
const { parse } = require('querystring');
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;

/* GET all rectangles. */
router.get('/', async (req, res, next) => {
  await res.app.locals.db.collection('rectangle').find({}).toArray((err, result) => {
    if (err){
      console.error(err)
    }
    if(result === undefined || result.length === 0){
      console.error('No Rectangle in database')
    } else {
      res.render('index', {data: result});
      //res.json(result)
      console.log('Found all rectangles')
    }
  })
})

/* GET rectangle by id */
router.get('/rectangle/get/:id', async (req, res, next) => {
  var Object_id = new ObjectId(req.params.id)
  await req.app.locals.db.collection('rectangle').find({
     _id : Object_id
    }).toArray((err, result) => {
    if(err){
      console.error(err)
    }
    if (result === undefined){
      console.error('No rectangle matching that id was found')
    } else {
      console.log('Found rectangle');
      res.render('display', {data: result})
    }
  })
})



/* Create a new Rectangle */
router.post('/rectangle/new', async (req, res, next) => {
  console.log('Adding new rectangle');
  // Automatically increase the field ID by 1
  const maxID = await req.app.locals.db.collection('rectangle').find().sort({ID: -1}).limit(1).toArray();
  const newId = +maxID[0].ID + 1;

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
      console.log(parse(body));
      const postValue = parse(body);

      req.app.locals.db.collection('rectangle').insertOne({
        ID: newId,
        width: Number(postValue.width),
        height: Number(postValue.height),
        color: postValue.color,
        name: postValue.name,
        age: Number(postValue.age),
      }, (err, result) => {
        if(err) throw err
        res.redirect('/')
        console.log('Created new rectangle')
      })
    })
  } 
  else{
    res.end("Something went wrong")
  }
  
})

/* Delete a Rectangle with existing id */
router.get('/rectangle/delete/:id', async (req, res, next) => {
  req.app.locals.db.collection('rectangle').deleteOne({
    _id : ObjectId(req.params.id)
  }, (err, result) => {
    if(err) throw err
    res.redirect('/')
    console.log('Delete corresponding rectangle')
  })
})

/* Change attributes of any of the rectangles */
router.post('/rectangle/update/:id', async (req, res, next) => {
  
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
      console.log(parse(body));
      const postValue = parse(body);

      req.app.locals.db.collection('rectangle').updateOne({
        _id: ObjectId(req.params.id)
      },
      {$set:
        {
          width: Number(postValue.width),
          height: Number(postValue.height),
          color: postValue.color,
          name: postValue.name,
          age: Number(postValue.age)
        }
      }, (err, result) => {
          if (err) throw err
          res.redirect('/')
          console.log(result)
          console.log('Sucessfully changed field(s)') 
        })
    })
  } 
  else{
    res.end("Something went wrong")
  }

})

module.exports = router;
