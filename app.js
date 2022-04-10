require('./models/db')
const routes = require('./routes/routes')

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const port = 3000;

app.set('trust proxy', 'loopback');
app.use(bodyParser.json())
app.use(cors())
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))