const siteRouter = require('./site');
const categoriesRouter = require('./categories');


function route(app) {
    
    app.use('/category', categoriesRouter);
    app.use('/', siteRouter);
}

module.exports = route;
