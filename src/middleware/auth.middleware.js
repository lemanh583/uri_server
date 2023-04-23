const jwt = require("jsonwebtoken")
const Upload = require("../controller/upload.controller")

const auth = (req, res, next) => {
    try {
        const auth = req.headers.authorization
        const token = auth && auth.split(' ')[1]
        let files = req?.files?.file
        if(!token) {
            if(files && !Array.isArray(files)) {
                files = [files]
            } 
            files.map(file => Upload.removeTmp(file.tempFilePath))
            return res.status(401).send({success: false, message: "Authentication failed"})
        }  
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if(error)
                return res.status(401).send({success: false, message: "Authentication failed"})
            req.user_id = decoded.id
            next()
        })      
    } catch (error) {
        console.error(error);
        return res.status(500).send({success: false, message: error.message})
    }
}

module.exports = { auth }