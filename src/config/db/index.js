const mongoose = require('mongoose');


async function connect() {

    try {
        await mongoose.connect('mongodb://localhost:27017/shop_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Yay!!!');
    }
    catch (err) {
        console.log('Oh no');
    }
}

module.exports = { connect };
