function paginationOrders(model) {
    return async function(req, res, next) {
        const page = parseInt(req.query.page || 1);
        const limit = 4;
        const startIndex = (page - 1) * limit;
        const results = {};
        let numberOfModels;

        try {
            // Find total models in page
            numberOfModels = await model.find({customerEmail: res.locals.user.email}).countDocuments();

            results.models = await model.find({customerEmail: res.locals.user.email}).sort({payAt: -1}).limit(limit).skip(startIndex);
            res.paginatedResults = results;
            
            const maxPage = Math.ceil(numberOfModels / limit);

            if(numberOfModels > limit && page < maxPage) {
                results.nextPage = page + 1;
            }

            if(page > 1) {
                results.previousPage = page - 1;
            }

            results.maxPage = maxPage;
            res.paginatedResults = results;
            
            next();
        }
        catch(err) {
            res.status(500).json({message: err.message});
        }

    }
}

module.exports = paginationOrders;
