require('./models/db')
const routes = require('./routes/routes')

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const port = 3000;

app.set('trust proxy', 'loopback');
app.use(bodyParser.json())
app.use(cors({
    origin: "*",
}))

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
    });
app.use(routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))