const express = require('express');
const path = require('path');
const dotenv  = require('dotenv')
const dbConnect = require('./config/db')
const indexRouter = require('./routes/main.route');


const app = express();
dotenv.config();
dbConnect()

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);
app.use('/register', indexRouter)


app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});


