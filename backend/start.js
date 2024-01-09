const app = require('./app/app')
const connectToDB = require('./db_connection/connectToDb')
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const mongo = await connectToDB(); // this is here to check the connection to db

    console.log(`---------------\n[DATABASE] Status: ${mongo.STATES[mongo.connection.readyState]}`);

    app.listen(PORT, () => {
      console.log(`[SERVER]   Status: connected\nStarted listening on PORT: ${PORT}\n---------------`)
    }
    )

  } catch (error) {
    console.log(error);
  }
}

start();
