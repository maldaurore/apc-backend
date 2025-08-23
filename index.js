import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import medicoRoutes from './routes/medicoRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import cors from "cors";

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
dotenv.config();

connectDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function(origin, callback) {
    if(dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}

app.use(cors(corsOptions));

app.use('/api/medicos', medicoRoutes);
app.use('/api/pacientes', pacienteRoutes);

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
})