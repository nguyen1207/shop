const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/shop_dev';

const connect = async () => {
    
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Yay!!!');
    }
    catch (err) {
        console.log(err);
        console.log('Oh no');
    }
}

module.exports = { connect };