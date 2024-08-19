const path = require("path");
const {v4: uuid} = require("uuid");

const uploadPhoto = async(req, res, next) => {
    try {
        const { image } = req.files
        
        const photoName = `${uuid()}${path.extname(image.name)}`
        image.mv(`${process.cwd()}/uploads/${photoName}`)
        
        res.status(201).json({status: 201, message: "Success!!!", data: `http://94.198.217.38:8080/${photoName}`})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    uploadPhoto
}