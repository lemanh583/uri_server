const Upload = require("../controller/upload.controller")

const checkUpload = (req, res, next) => {
    if(!req.files) {
        return res.status(500).send({success: false, message: "No img upload"})
    }
    let files = req.files?.file
    if(!Array.isArray(files)) {
        files = [files]
    }
    files = files.filter(file => {
        let type = Upload.checkTypeFile(file)
        let condition = ["video", "image"].includes(type) && file.size < (25 * 1024 * 1024)
        if(!condition) {
            Upload.removeTmp(file.tempFilePath)
        } else {
            return file
        }
    })
    if(files.length == 0) {
        return res.status(500).send({success: false, message: "Format or Size big -- 25mb"})
    }
    next();
}

module.exports = checkUpload