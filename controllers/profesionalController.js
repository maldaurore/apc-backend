import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistro from "../helpers/emailRegistro.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Profesional from "../models/Profesional.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  const existeUsuario = await Profesional.findOne({ email });

  if (existeUsuario) {
    const error = new Error("El email ya está registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const profesional = new Profesional(req.body);
    const profesionalGuardado = await profesional.save();

    await emailRegistro({
      email,
      nombre,
      token: profesionalGuardado.token,
    });
    res.json(profesionalGuardado);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al registrar el usuario" });
  }
};

const perfil = (req, res) => {
  const { profesional } = req;
  res.json({ profesional });
}

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Profesional.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = null;
    await usuarioConfirmar.save();

    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Profesional.findOne({ email });

  // Comprobar si el usuario existe
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Revisar password
  if ( await usuario.comprobarPassword(password) ) {
    // Autenticar usuario
    return res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id)
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
}

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeProfesional = await Profesional.findOne({ email });
  if (!existeProfesional) {
    const error = new Error("El email no está registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeProfesional.token = generarId();
    await existeProfesional.save();

    emailOlvidePassword({
      email,
      nombre: existeProfesional.nombre,
      token: existeProfesional.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al enviar el email" });
  }
} 

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Profesional.findOne({ token });
  if (!tokenValido) {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: "Token válido y el usuario existe" });

}

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const profesional = await Profesional.findOne({ token });
  if (!profesional) {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }

  try {
    profesional.token = null;
    profesional.password = password;
    await profesional.save();
    res.json({ msg: "Contraseña modificada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al modificar la contraseña" });
  }
}

const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;

  try {
    const profesional = await Profesional.findById(id);
    if (!profesional) {
      const error = new Error("Profesional no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if(profesional.email !== email) {
      const existeEmail = await Profesional.findOne({ email });
      if (existeEmail) {
        const error = new Error("Este email ya está en uso");
        return res.status(400).json({ msg: error.message });
      }
    }

    profesional.nombre = nombre || profesional.nombre;
    profesional.email = email || profesional.email;
    profesional.telefono = telefono || profesional.telefono;

    const profesionalActualizado = await profesional.save();
    res.json({ profesional: profesionalActualizado });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al actualizar el perfil" });
  }
}

const actualizarPassword = async (req, res) => {
  const { id } = req.params;
  const { passwordActual, passwordNueva } = req.body;

  try {
    const profesional = await Profesional.findById(id);
    if (!profesional) {
      const error = new Error("Profesional no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if (!await profesional.comprobarPassword(passwordActual)) {
      const error = new Error("La contraseña actual es incorrecta");
      return res.status(403).json({ msg: error.message });
    }

    profesional.password = passwordNueva;
    await profesional.save();
    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al actualizar la contraseña" });
  }
}

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
}