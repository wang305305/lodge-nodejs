const mongoose = require('mongoose');


if (process.env.NODE_ENV === 'development') {
  db_url = 'mongodb://localhost:28081/lodge_db'
}

if (process.env.NODE_ENV === 'production') {
  db_url = 'mongodb://127.0.0.1:27017/lodge_db'
}


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}

require('./user.model')