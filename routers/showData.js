const router = require("express").Router();
const db = require("../configs/DBconnection");

// Function to form query according to filter selected
const getQuery = (table, column, filter, value) => {
  let sqlQuery = `SELECT * FROM ${table} WHERE ${column} `;

  if (filter === "=") {
    sqlQuery += `= "${value}"`;
  } else if (filter === "!=") {
    sqlQuery += `!= "${value}"`;
  } else if (filter === "LIKE s") {
    sqlQuery += `LIKE '${value}%'`;
  } else if (filter === "LIKE e") {
    sqlQuery += `LIKE '%${value}'`;
  } else if (filter === "LIKE c") {
    sqlQuery += `LIKE '%${value}%'`;
  } else if (filter === "NOT LIKE c") {
    sqlQuery += `NOT LIKE '%${value}%'`;
  } else if (filter === "IS NULL") {
    sqlQuery += `IS NULL`;
  } else if (filter === "IS NOT NULL") {
    sqlQuery += `IS NOT NULL`;
  } else if (filter === ">") {
    sqlQuery += `> ${value}`;
  } else if (filter === "<") {
    sqlQuery += `< ${value}`;
  } else if (filter === "TRUE") {
    sqlQuery += `= 1`;
  } else if (filter === "FALSE") {
    sqlQuery += `= 0`;
  }
  return sqlQuery;
};

//Function to get the list of tables
const getTables = async (email, res, processResult) => {
  db.query(
    `SELECT * FROM tableInfo WHERE email = "${email}"`,
    function (err, result) {
      if (err) res.render("dashboard");
      processResult(result);
    }
  );
};

//Function to show the table data
const showTable = async (query, table, res, processResult) => {
  db.query(query, function (err, tableData) {
    if (err) res.render("dashboard");
    let col = [];
    if (tableData.length !== 0) col = Object.keys(tableData[0]);
    processResult(table, col, tableData);
  });
};

router.get("/view", async (req, res) => {
  getTables(req.session.user.email, res, (rs) => {
    res.render("viewTable", { data: rs });
  });
});

router.post("/view", async (req, res) => {
  let data = { ...req.body };
  if (data.column !== undefined) {
    let dt;
    db.query(
      `select column_name,data_type from information_schema.columns where table_schema = 'tablecreator' and table_name = '${data.tableName} '`,
      function (err, dataType) {
        if (err) res.render("dashboard");
        dataType.forEach((row) => {
          if (row.COLUMN_NAME == data.column) {
            dt = row.DATA_TYPE;
            return;
          }
        });
      }
    );
    let query = `SELECT * FROM ${data.tableName}`;
    if (data.filter != undefined && data.value != "") {
      query = getQuery(data.tableName, data.column, data.filter, data.value);
    }

    getTables(req.session.user.email, res, (rs) => {
      showTable(query, data.tableName, res, (table, col, tableData) => {
        res.render("viewTable", {
          data: rs,
          tables: tableData,
          column: col,
          tablename: table,
          datatype: dt,
          selectedCol: data.column,
        });
      });
    });
  } else {
    const query = `SELECT * FROM ${data.tableName}`;
    getTables(req.session.user.email, res, (rs) => {
      showTable(query, data.tableName, res, (table, col, tableData) => {
        res.render("viewTable", {
          data: rs,
          tables: tableData,
          column: col,
          tablename: table,
          datatype: undefined,
          selectedCol: undefined,
        });
      });
    });
  }
});

module.exports = router;
