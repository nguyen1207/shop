const siteRouter = require('./site');
const productRouter = require('./product');
const accountRouter = require('./account');

function route(app) {
    
    app.use('/category', productRouter);
    app.use('/account', accountRouter);
    app.use('/', siteRouter);
}

module.exports = route;
