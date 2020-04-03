const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({ // see https://www.npmjs.com/package/multer
    destination: (req, file, cb) => {
        cb(null, 'public/images'); //null means there is no error
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname) //filename on the server will be the same as the one on client side
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { // only files with these extensions will be accepted; regex used       
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true); //no error; true - file can be accepted
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter}); // calling multer function

const uploadRouter = express.Router(); // router set-up

//Endpoints

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => { // imageFile is the client side form's input fieldname; single file upload
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file); //file object is added to the req object by multer; contains additional info about uploaded file
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;