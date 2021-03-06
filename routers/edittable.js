const router =  require("express").Router();
const db = require("../configs/DBconnection");
const {requiresAuth} = require('express-openid-connect');


const getStrings = (body, colData)=> {
    let col="", val="", empty="";
    let data={...body};
    delete data.table;
    for(let i=0; i<colData.length && Object.keys(data).length>0; i++){
        col += colData[i].COLUMN_NAME +",";
        if(data[`${colData[i].COLUMN_NAME}`] ==''){
            val+= `NULL,`;
        }
        else if(colData[i].DATA_TYPE ==='int' || colData[i].DATA_TYPE === 'tinyint'){
            empty="NO"
            val+= data[`${colData[i].COLUMN_NAME}`] + " ,";
        }
        else{
            empty="NO"
            val += `'${data[`${colData[i].COLUMN_NAME}`]}' ,`;
        }
    }
    col = col.substring(0, col.length -1);
    val = val.substring(0, val.length -1);
    console.log(col, val)
    return{ col, val, empty}
}


const getTables = async(email, processResult) => {
    db.query(`SELECT tableName FROM tableInfo WHERE email = "${email}";`, function (err, allTables) {
        if (err) 
            res.render('dashboard');
            processResult(allTables);
    });	
}



//edit table route
router.get("/edit", requiresAuth(), async(req, res)=>{
    res.render('edittable');
})

//insert data routes
router.get("/insertdata", requiresAuth(), async(req, res)=>{
    try{
        getTables(req.oidc.user.email, (allTables)=>{
            res.render('insertData', {tableNames: allTables} );
        })
    }catch(err){
        console.log(err.message);
        res.status(500).send('internal server error ')
    }    
})



router.post("/insertdata", requiresAuth(), async(req, res)=>{
    try{
        db.query(`SELECT COLUMN_NAME, data_type FROM information_schema.columns WHERE TABLE_SCHEMA = "tablecreator" AND TABLE_NAME = "${req.body.table}";`, function (err, colData) {
            if (err) console.log(err);
            console.log(colData);
            
            db.query(`SHOW KEYS FROM ${req.body.table} WHERE key_name = "PRIMARY"`, function(err, keyData){

                getTables(req.oidc.user.email, (allTables)=>{
                    let {col, val, empty} = getStrings(req.body, colData);
                        
                        if(empty!==''){
                            
                            db.query(`INSERT INTO ${req.body.table} (${col}) VALUES (${val});`, function (err, intertedData) {
                                if (err) 
                                    return res.render('insertData',{data:colData, key_col:keyData[0].Column_name, tableNames:allTables, selected_table:req.body.table, intertedData: intertedData, msg: err, color:'alert-danger'});
                                
                                    db.query(`INSERT INTO history(email, history, time) VALUES("${req.oidc.user.email}", "A row is inserted in '${req.body.table}' table", NOW());`,
                                        function (err, result) {})

                                res.render('insertData',{data:colData, key_col:keyData[0].Column_name, tableNames:allTables, selected_table:req.body.table, intertedData: intertedData, msg: 'Row inserted successfully!', color:'alert-success'});
                            });	
                        }
                        else{
                            res.render('insertData',{data:colData, key_col:keyData[0].Column_name, tableNames:allTables, selected_table:req.body.table});
                        }
                    });	 
                })
            });
        }catch(err){
            console.log(err.message);
            res.status(500).send('internal server error ')
        }	  
    })


//delete data routes
router.get("/deletedata", requiresAuth(), async(req, res)=>{
    try{
        getTables(req.oidc.user.email, (allTables)=>{
            res.render('deleteData', {tableNames: allTables} );
        })
    }catch(err){
        console.log(err.message);
        res.status(500).send('internal server error ')
    }
})

router.post("/deletedata", requiresAuth(), async(req, res)=>{
    try{
        getTables(req.oidc.user.email, (allTables)=>{
            db.query(`SELECT * FROM ${req.body.table};`, function (err, data) {
                db.query(`SHOW KEYS FROM ${req.body.table} WHERE key_name = "PRIMARY"`, function(err, keyData){
                    
                    if(typeof req.body.delete!='undefined')
                        {
                            console.log(`DELETE FROM ${req.body.table} WHERE ${keyData[0].Column_name} = "${req.body.delete}";`)
    
                            console.log(req.body)
                            db.query(`DELETE FROM ${req.body.table} WHERE ${keyData[0].Column_name} = "${req.body.delete}";`, function (err, d) {
    
                                db.query(`INSERT INTO history(email, history, time) VALUES("${req.oidc.user.email}", "A row is deleted in '${req.body.table}' table", NOW());`,
                                    function (err, result) {})
                                
                                db.query(`SELECT * FROM ${req.body.table};`, function (err, data2){
                                    res.render('deleteData', {data: data2, tableNames: allTables, col_data: data[0], selected_table: req.body.table, key_col: keyData[0].Column_name, msg:'Row deleted Successfully!'} );
                                })
                            })
                        }
                        else{
                            res.render('deleteData', {tableNames: allTables, data:data, col_data:data[0], key_col: keyData[0].Column_name, selected_table: req.body.table});
                        }
                })
            })  
        }) 
    }catch(err){
        console.log(err.message);
        res.status(500).send('internal server error ')
    }
})


module.exports = router;