const express = require('express')
const { verifyToken } = require('../middleware/verifyToken')
const router = express.Router();


//Home Page
router.get('/', (req,res)=>{
    res.render('index')
})


//Auth Pages

//Login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//Register
router.get("/register", (req, res) => {
  res.render("auth/register");
});

//Dashboard
router.get('/dashboard', verifyToken, (req, res)=>{
    res.render('dashboard/dashboard')
})

router.get("/invite/:token", (req, res) => {
  res.render("workspace/accept-invite", {
    token: req.params.token,
  });
});
 
module.exports = router