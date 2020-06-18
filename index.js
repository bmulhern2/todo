var express = require('express');
var app = express();
var http = require('http');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var Pool = require('pg').Pool;
var pool = new Pool({
    user: "wnovfwvgimkslp",
    host: "ec2-18-214-211-47.compute-1.amazonaws.com",
    database: "d5tep7u9lv3lf0",
    password: "987cf38980938386140c1447f981848345d1e0dfc87e9b42049e047d5a902782",
    port: 5432,
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    var todos = await pool.query("SELECT * FROM todos");
    res.render('home', { todos: todos.rows });
}); 
app.post('/post', function(req, res) {
    var todo = req.body.todo;
    pool.query("INSERT INTO todos (todo) VALUES ($1)", [todo]);
    res.redirect('/');
})
app.post('/todos/delete/:id', async (req, res) => {
    await pool.query("DELETE FROM todos WHERE id = $1", [req.params.id]);
    res.redirect('/');
});
var port = process.env.PORT || 8080;
http.createServer(app).listen(port, function() {
    console.log("Server started on Port " + port)
})
