const express = require('express');
const path = require('path');
const indexRouter = require('./routes/main.route');
const app = express();

// serve static assets from <project>/public so /assets/Logo.svg -> public/assets/Logo.svg
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});


