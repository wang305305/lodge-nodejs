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
    origin: "http://localhost:4200",
    credentials: true
}))

// var multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })

// const upload = multer({ storage: storage })

const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })


app.use(routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))