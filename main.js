var express = require("express");
var hbs = require("hbs");
const async = require("hbs/lib/async");
const { ObjectId } = require("mongodb");

var app = express();

var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017";
var url =
    "mongodb+srv://thorgia:khai1702@cluster0.podvmmf.mongodb.net/test";

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
////////////////////////////////////////////////////////

//method

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/new', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    let cates = await dbo.collection("categories").find().toArray()
    res.render('newForm', { categories: cates })
})

app.post('/insertProduct', async (req, res) => {
    let name = req.body.txtName
    let price = Number(req.body.txtPrice)
    let picURL = req.body.txtPic
    let cate = req.body.txtCates
    let product = {
        'name': name,
        'price': price,
        'picture': picURL,
        'category': cate
    }
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    await dbo.collection("menu").insertOne(product)
    res.redirect('/view')

})

app.post('/insertCategory', async (req, res) => {
    let cateG = req.body.txtCates
    let category = {
        'category': cateG
    }
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    await dbo.collection("categories").insertOne(category)
    res.redirect('/new')
})

app.get('/manage', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    let prods = await dbo.collection("menu").find().toArray()
    console.log(prods)
    res.render('manageForm', { 'prods': prods })
})

app.get('/view', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    let prods = await dbo.collection("menu").find().toArray()
    console.log(prods)
    res.render('viewForm', { 'prods': prods })
})

app.post('/search', async (req, res) => {
    let name = req.body.txtSearch
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    //For substring search, case insensitive
    let prods = await dbo.collection("menu").
        find({ 'name': new RegExp(name, 'i') }).toArray()
    console.log(prods)
    res.render('viewForm', { 'prods': prods })
})

app.get('/delete', async (req, res) => {
    let id = req.query.id
    console.log(id)
    let objectId = ObjectId(id)
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    //For substring search, case insensitive
    await dbo.collection("menu").deleteOne({ _id: objectId })
    res.redirect('/manage')
})

app.get('/edit', async (req, res) => {
    let id = req.query.id
    let objectId = ObjectId(id)
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    let prod = await dbo.collection("menu").findOne({ _id: objectId })
    console.log(prod)
    res.render('edit', { 'prod': prod })
})

app.post('/update', async (req, res) => {
    let id = req.body.id
    let objectId = ObjectId(id)
    let name = req.body.txtName
    let price = Number(req.body.txtPrice)
    let picURL = req.body.txtPic
    let cate = req.body.txtCates
    let product = {
        'name': name,
        'price': price,
        'picture': picURL,
        'category': cate

    }
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNdatabase");
    await dbo.collection("menu").updateOne({ _id: objectId }, { $set: product })
    res.redirect('/manage')

})
////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")