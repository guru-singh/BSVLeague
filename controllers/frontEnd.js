const path = require('path');

exports.postApi = (req, res, next) => {
    console.log('demo', req.body);
    res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/api.html`);
};
