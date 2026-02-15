const {body, validationResult} = require('express-validator')

const registerValidator = [
    body('workspaceName').trim().notEmpty().isLength({ min: 3}),
    body('username').trim().notEmpty().isLength({min: 4, max: 12}),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({min: 8}),
(req,res,next)=>{
    const err = validationResult(req)
    if(!err.isEmpty()){
        return res.status(422).json({
            success: false,
            err: err.array(),
        })
    }
   next()
}
]

module.exports = { registerValidator }
