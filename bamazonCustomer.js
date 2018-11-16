var express = require("express");
var mysql   = require("mysql");
var myhttp  = require("http");
var logger  = require('morgan');
var ejs     = require("ejs");
var fs      = require('fs');
var path    = require('path');
var inquirer = require("inquirer");
var bodyParser = require('body-parser');

// Create instance of express app
var hbs  = require('express-handlebars');
var app = express();
app.engine('hbs', hbs( {extname: 'hbs', defaultLayout: 'layout', layoutDir: __dirname + '/views/layouts' } ));
app.set('views', path.join(__dirname, 'views' ));
app.set('view engine', 'hbs');


app.set('PORT', 3001);
app.use(express.static(__dirname + '../public'));
var PORT = 3001;


// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "nV4k74rA!",
  database: "bamazon",
  charset: "utf8"
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  } else {
 
    console.log('Connected to the MySQL server.');
    }
});

var sql1 = "select * from products";
var product = '';
var quantity = 0;
var myProduct = '';
var myQuantity = 0;

connection.query(sql1, function(err, rows) {
        if(err) {
            console.log(err);
            return;
        } 
        rows.forEach(function(result) {
            console.log(result.id, result.product_name, result.department_name, result.price, result.stock_quantity)

        });

        inquirer.prompt([{
            name: 'product',
            type: 'input',
            message: 'What product do you want to purchase?',
          }, {
            name: 'quantity',
            type: 'input',
            message: 'How many do you want to purchase?'
          }]).then((answers) => {
            myProduct = answers.product;
            myQuantity = answers.quantity


            connection.query("SELECT * FROM products WHERE product_name=?", myProduct, function(err, rows) {
                if(err) {
                    console.log(err);
                    return;
                } 
                rows.forEach(function(result) {
                    console.log("You selected: " + result.product_name + " at a price of $" + result.price*myQuantity)
                })
                });

          });

    });


app.get('/', function(request, response, next) {
    var context = {};
    connection.query(sql1, function(err, rows, fields){
        if(err) {
            next(err);
            return;
        } 
            context.results = JSON.stringify(rows);
            response.render('home', context);
        });
    });


    app.use(function(request, resposne){
        response.status(404);
        response.render('404');
    });

    app.use(function(err, request, response, next){
        console.error(err.stack);
        response.status(500);
        response.render('500');
    });

    app.listen(PORT, function() {
        console.log("Server is listening on PORT: " + PORT);
      });
