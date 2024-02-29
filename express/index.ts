import mongoose from 'mongoose';
import app from './src/app';

const port = process.env.PORT || 5001;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`);
});