const mongoose = require('mongoose');
const DB_ADRESS = process.env.DB_ADDRESS

const connectToDB = async () => {
  const mongoDB = mongoose.connect(DB_ADRESS);
  let retryCountToDatabase = 0;
  try {
    while (true) {
      const mongo = await mongoDB;

      if (mongo.connection.readyState === 1) {
        return mongo;
      }
      if (retryCountToDatabase >= 10) {
        console.log('Too many tries, quitting... Check if everything is in order and try again.\n');
        process.abort();
      }
      retryCountToDatabase++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // wait a little
      console.log(`[ERROR] Connection to MongoDB cluster is failed. Retrying in a second... ${retryCountToDatabase} of 10`);
    }
  } catch (error) {
    console.log(`[ERROR] - Couldn't even start the connection to  MongoDB cluster!\n- ${error.message}`)
  }
};

module.exports = connectToDB;
