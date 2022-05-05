require('./models/db')
const routes = require('./routes/routes')

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const port = 3000;

app.set('trust proxy', 'loopback');
app.use(bodyParser.json())


if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: "http://localhost:4200",
        credentials: true
    }))
}

if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: ["http://lodgeexp.com","https://lodgeexp.com","http://www.lodgeexp.com","https://www.lodgeexp.com"],
        credentials: true
    }))
    
}


const multer = require('multer')
const upload = multer({ dest: './public/data/uploads/' })


app.use(routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))
