const express = require('express');
const app = express();
const mysql = require("mysql");
const port = process.env.PORT || 5000 ; 

let pool = mysql.createPool({
    connectionLimit: 100,
    host: 'database-2.c0ahoh4seyzg.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password123',
    database: 'dbOne',
    port: 3306,
    debug: false
});

app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
});

// This function is getting all the users from the table called users2 that is connected to my dbOne. 
let getUsers2 = (req, res) => {
    pool.query('SELECT * FROM users2', function(err, rows) {
        if(err){
            return res.json({
                'error': true, 
                'message': 'error occured:' + err
            })
        } else {
            res.json(rows)
        }
    })
}

app.get('/', function(req, res){
    getUsers2(req, res)
})
// when I run the code above, and refresh localhost:5000 , 
// all of the id's, first name's and last names from my table users2 will show up in json



// next I wrote code using .format() meth to get the first_name of users who have an ID of less than 10
// using .format makes the code more dynamic
// if we were NOT writing dynamically , it would look like:
// SELECT id, first_name FROM users2 WHERE id < 10

function get_first_names(req, res) {
    let sql = 'SELECT ??, ?? FROM ?? WHERE ?? < ?' ;
    // important to note that the last ? is only ONE ?
    // also important that sql is a LET variable
    const replacements = ['id', 'first_name', 'users2', 'id', 10];
    sql = mysql.format(sql, replacements);
    pool.query(sql, function(err, rows){
    if(err){
        return res.json({
            'error': true, 
            'message': 'error occured:' + err
        })
    } else {
        res.json(rows)
        }
    })
}

// http://localhost:5000/first_names will show the users id and name for those with id's less then ten! 

app.get('/first_names', function(req, res) {
    get_first_names(req, res)
})