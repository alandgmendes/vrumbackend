import mongoose from "mongoose";


const dbConnect = () =>{
  // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
  //change line below to hide connection string on production
  mongoose
    .connect(
        "mongodb+srv://vrumUser:Pass1234@vrum.kamzhos.mongodb.net/?retryWrites=true&w=majority",
      {
        //   these are options to ensure that the connection is done properly
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

export default dbConnect;