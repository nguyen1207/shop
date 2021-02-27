const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

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