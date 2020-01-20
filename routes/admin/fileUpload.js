const routes = require('express').Router();


let fileUploadFunctionv = (req, res,next)=>{

 res.status(200).json({ message: 'Connected!' });
}

routes.post('/fileUpload',fileUploadFunctionv)

module.exports = routes;