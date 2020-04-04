const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) { //checks if req origin header matches one of the origins in whitelist; -1 means no match - indexOf JavaScript method 
        corsOptions = { origin: true }; // req accepted
    } else {
        corsOptions = { origin: false }; //No CORS header included in the response
    }
    callback(null, corsOptions);
};

exports.cors = cors(); // allows CORS for all origins; middleware function is returned
exports.corsWithOptions = cors(corsOptionsDelegate); // allows CORS only for origins in whitelist; middleware function is returned