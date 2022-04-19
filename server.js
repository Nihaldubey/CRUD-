const bodyParser = require('body-parser');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();


 app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const connect_string = 'mongodb+srv://XXXX:XXXXX@cluster0.a0zpu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


app.use(bodyParser.json()) 

MongoClient.connect(connect_string, {
    useUnifiedTopology: true
  }).then((client) => {
    console.log("database connected");

    
    const db = client.db('Star-wars-quotes');


    const quotesCollection = db.collection("quotes"); 
    app.post('/quote', (req, res) => {

        quotesCollection.insertOne(req.body)
        .then((result) => {
            console.log(result);
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        })
    })

   

    app.put('/quotes', (req, res) => {
  
        quotesCollection.findOneAndUpdate({name: 'Jayashree Panda'}, 
        { $set: 
            {name: req.body.name,
            query: req.body.query}
        },
        {
            upsert: true
        }) 
        .then((result) => {
            res.json('success')
            console.log(result);
        })   
        .catch((err) => {
            console.log(err);
        })    
    })

    app.delete('/quotes', (req, res) =>{
        quotesCollection.deleteOne({name : req.body.name})
        .then((result) =>{
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json('Jayashree Pa quote is deleted');
        })
        .catch((err) => {
            console.log(err);
        })
    })
    
    app.get('/', (req, res) => {

        db.collection("quotes").find().toArray()
        .then((result) => {
         
            res.render('index.ejs', {quotes: result});
        })
        .catch((err) => {
            console.log(err);
        })
        
    })
  }).catch((err) => {
      console.log(err);
  })



app.listen(4000, () => {
    console.log("App listening at port 4000");
})