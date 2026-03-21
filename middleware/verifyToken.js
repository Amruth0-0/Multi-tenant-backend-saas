const jwt = require("jsonwebtoken")

exports.verifyToken = (req, res, next)=>{
       const authHeader = req.header("Authorization")
       if(!authHeader || !authHeader.startsWith("Bearer ")){
          return res.status(401).json({
            success: false,
            message: "Unauthorized"
          })
        }

        const token = authHeader.split(' ')[1]
        try{ 
             if(!process.env.JWT_SECRET){
                   throw new Error("JWT_SECRET not defined")
             }
             const decoded = jwt.verify(token, process.env.JWT_SECRET)

             if(!decoded.userId){
              return res.status(401).json({
                success: false,
                message: "Invalid Payload"
              })
             }

             req.user = {
                userId: decoded.userId,
                workspaceId: decoded.workspaceId,
                tenantId: decoded.tenantId,
                role: decoded.role
             };

             next()
             
        }catch(error){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
}

