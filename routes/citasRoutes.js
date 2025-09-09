import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { guardarCita, obtenerCitas } from "../controllers/citasController.js";

const router = express.Router();

router.route('/')
  .get(checkAuth, obtenerCitas)
  .post(checkAuth, guardarCita);

export default router;