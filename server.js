const express = require('express');
const path = require('path');
const dotenv  = require('dotenv')
const dbConnect = require('./config/db')
const indexRouter = require('./routes/main.route');
const authRouter = require('./routes/auth.route')
const workspaceRouter = require('./routes/workspace.route')
const projectRouter = require('./routes/project.route')
const taskRouter = require('./routes/task.route')
const workspaceMemberRouter = require('./routes/workspaceMember.route')


const app = express();
dotenv.config();
dbConnect()

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use("/api/projects", projectRouter)
app.use("/api/tasks", taskRouter)
app.use('/api/workspace-members', workspaceMemberRouter)


app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});


