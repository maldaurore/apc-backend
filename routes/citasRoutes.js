import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { guardarCita, obtenerCitas, obtenerCitasProfesional } from "../controllers/citasController.js";

const router = express.Router();

router.route('/')
  .get(checkAuth, obtenerCitas)
  .post(guardarCita);

router.get('/profesional/:id', obtenerCitasProfesional);

export default router;