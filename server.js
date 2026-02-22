const express = require('express');
// const path = require('path');
const dotenv  = require('dotenv')
const dbConnect = require('./config/db')
const indexRouter = require('./routes/main.route');
const authRouter = require('./routes/auth.route')
const workspaceRouter = require('./routes/workspace.route')


const app = express();
dotenv.config();
dbConnect()

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/workspaces', workspaceRouter)


app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});


