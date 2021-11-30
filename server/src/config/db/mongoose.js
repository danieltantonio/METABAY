(() => {
    const mongoose = require('mongoose');
    const url = process.env.DB_URL;

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(res => {
        console.log("Successfully connected to DB 💾");
    })
    .catch(err => {
        console.log(err);
    });

    const connection = mongoose.connection;

    module.exports = connection
})();