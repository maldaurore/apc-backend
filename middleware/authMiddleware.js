import jwt from "jsonwebtoken";
import Medico from "../models/Medico.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.medico = await Medico.findById(decoded.id).select("-password -token -confirmado");
      return next();
    } catch (err) {
      const error = new Error("Token no valido");
      return res.status(403).json({ msg: error.message });
    }
  } else {
    const error = new Error("Token no encontrado");
    return res.status(403).json({ msg: error.message });
  }

};

export default checkAuth;