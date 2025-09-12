import express from "express";
import { perfil, registrar, confirmar, autenticar, olvidePassword, nuevoPassword, comprobarToken, actualizarPerfil, actualizarPassword } from "../controllers/profesionalController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.get("/perfil", checkAuth, perfil);
router.put("/actualizar-password/:id", checkAuth, actualizarPassword);

export default router;