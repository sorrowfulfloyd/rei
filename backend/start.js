const { PORT, connectToDB, app } = require('./app/app')

const start = async () => {
  try {
    let mongo = await connectToDB(); // this is here to check the connection to db

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