import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI)

    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`Conectado a la base de datos: ${url}`);
  } catch (error) {
    console.log(`Error al conectar a la base de datos: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;