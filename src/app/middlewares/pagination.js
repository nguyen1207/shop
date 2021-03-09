function pagination(model) {
    return async function(req, res, next) {
        const page = parseInt(req.query.page || 1);
        const category = req.params.category; // Used on show pages
        const keywords = req.query.q; // Used on search page 
        const limit = 40;
        const startIndex = (page - 1) * limit;
        const results = {};
        let numberOfModels;

        try {
            // Find total number of models and models in page
            if(keywords) {
                numberOfModels = await model.find(
                    {
                        $or: [
                            {name: {
                                $regex: new RegExp(keywords.split(" ").join('|')),
                                $options: 'i',
                            }},
                            {category: {
                                $regex: new RegExp(keywords.split(" ").join('|')),
                                $options: 'i',
                            }},
                        ]
                    })
                    .countDocuments();

                results.models = await model.find(
                    {
                        $or: [
                            {name: {
                                $regex: new RegExp(keywords.split(" ").join('|')),
                                $options: 'i',
                            }},
                            {category: {
                                $regex: new RegExp(keywords.split(" ").join('|')),
                                $options: 'i',
                            }},
                        ]
                    })
                    .limit(limit)
                    .skip(startIndex);
                    
            }
            else if(category) {
                numberOfModels = await model.find({category: category}).countDocuments();

                results.models = await model.find({category: category}).limit(limit).skip(startIndex);
                
            }

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

module.exports = pagination;
