const mongoose = require('mongoose');

const uri = `mongodb://127.0.0.1:27017/authenDEV`;
const PORT = 27017;

mongoose.connect(uri)
    .then(() => {
        console.log(`Successfully connected to the database on PORT ${PORT}`);
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = mongoose;
