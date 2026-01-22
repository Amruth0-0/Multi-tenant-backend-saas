const {body, validationResult} = require('express-validator')

const registervalidator = (req,res,next)=>{
    body('Workspace').trim().notEmpty().isLength({ min: 3})
    body('Username').trim().notEmpty().isLength({min: 4, max})
    body('Email').trim().isEmail().isLength({min: 4})
    body('password').trim().notEmpty().isLength({min: 5})
    
    const err = validationResult(req)
    if(!err.isEmpty()){
        return res.status(422).json({
            err: err.array(),
            message: "Invalid Data"
        })
    }
    next()
}

module.exports = reqistervalidator