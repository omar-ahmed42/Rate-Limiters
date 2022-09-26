const express = require('express');

const app = express();
const authenticationRouter = require('./routes/authentication.js');
require('dotenv').config();

app.use(express.json());
app.use('/api/v1/', authenticationRouter);
app.listen(process.env.PORT, () => {
    console.log(`Server is now listening on port ${process.env.PORT}`);
});
