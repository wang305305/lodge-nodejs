const mongoose = require('mongoose');


db_url = 'mongodb://localhost:28081/lodge_db'

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}

require('./user.model')