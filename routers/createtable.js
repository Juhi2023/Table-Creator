const router =  require("express").Router();
const db = require("../configs/DBconnection");
const {requiresAuth} = require('express-openid-connect');


const getQuery= (tableData)=>{
    let data = {...tableData};
    let sqlQuery = `CREATE TABLE ${data.tableName} (`
    for(let i=0; i<data.colNumber; i++)
    {
        if(data[`dataType${i+1}`] === 'string')
            data[`dataType${i+1}`] = 'text'
        if(data[`dataType${i+1}`] === 'boolean')
            data[`dataType${i+1}`] = 'tinyint'
        if(data[`dataType${i+1}`] === 'number')
            data[`dataType${i+1}`] = 'int'
        if(data[`dataType${i+1}`] === 'email')
            data[`dataType${i+1}`] = 'varchar(30)'
        sqlQuery += ` ${data[`colName${i+1}`]} ${data[`dataType${i+1}`]},`
        if(data.primaryKey == i+1)
        {
            sqlQuery = sqlQuery.substring(0, sqlQuery.length -1) + ` PRIMARY KEY,`
        }
    }
    sqlQuery = sqlQuery.substring(0, sqlQuery.length -1) + `);`
    return sqlQuery;
}


//create table routes
router.get("/create", requiresAuth(), async(req, res)=>{
    res.render('createtable');
})


router.post("/create", requiresAuth(), async(req, res)=>{
   
    try{
        sqlQuery = getQuery(req.body)
        db.query(sqlQuery, function (err, result) {
            if (err) 
                return res.render('createtable', {msg: err, color: "alert-danger"} );
                
            db.query(`INSERT INTO history(email, history, time) VALUES("${req.oidc.user.email}", "'${req.body.tableName}' table is created", NOW());
                    INSERT INTO tableInfo (email, tableName) VALUES("${req.oidc.user.email}", "${req.body.tableName}");`,
                function (err, result) {})

            res.render('createtable', {data: req.body, msg: `Table '${req.body.tableName}' successfully created`, color: "alert-success"} );
        });	
    }catch(err){
        console.log(err.message);
        res.status(500).send('internal server error ')
    }
})

module.exports = router;