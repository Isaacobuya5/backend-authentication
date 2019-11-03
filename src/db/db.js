const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
}).then(() => {
    console.log("Succesfully connected to the database")
}).catch((error) => {
    console.log("Unable to connect to the database");
    console.error(error);
})