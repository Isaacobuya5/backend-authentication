//define our express server
const express = require('express');

const port = process.env.PORT

const app = express();

const userRouter = require('./routers/user');
require('./db/db');


app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})