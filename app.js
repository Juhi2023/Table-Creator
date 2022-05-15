const express = require("express");
const ejs = require('ejs');
const app= express();
const path = require("path");
const bodyparser= require("body-parser");
const db = require("./configs/DBconnection");
const formRoutes = require("./routers/form");
const createtableRoutes = require("./routers/createtable");
const auditHistoryRoutes = require("./routers/auditHistory");
const deletetableRoutes = require("./routers/deletetable");
const showDataRoutes = require('./routers/showData');


//middlewares
app.set('view engine', 'ejs');

//initialize app
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//path
const static_path= path.join(__dirname, "public");
app.use(express.static(static_path));


//db connection
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
//user table creation
db.query(`CREATE TABLE IF NOT EXISTS users (name VARCHAR(30) NOT NULL, email VARCHAR(30) PRIMARY KEY, password VARCHAR(225) NOT NULL);`, function (err, result) {
    if (err) throw err;
    console.log("user Table created");
});

//table info table creation
db.query(`CREATE TABLE IF NOT EXISTS tableInfo (sno INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30), tableName VARCHAR(225) NOT NULL);`, function (err, result) {
    if (err)  throw err;
    console.log("table info Table created");
});

//audit history table creation
db.query(`CREATE TABLE IF NOT EXISTS history  (sno INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30), history VARCHAR(100) NOT NULL,  time DATETIME NOT NULL);`, function (err, result) {
    if (err)  throw err;
    console.log("audit history Table created");
});

//routing
app.get('/', function (req, res) {
    res.render('index');
})

//routers
app.use("/", formRoutes);
app.use("/", createtableRoutes);
app.use("/", auditHistoryRoutes);
app.use("/", deletetableRoutes);
app.use("/",showDataRoutes);

//port
const port = process.env.PORT || 4000;
app.listen(port, ()=>{ console.log(`listening at port: ${port}`); })