import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistro from "../helpers/emailRegistro.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Medico from "../models/Medico.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  const existeUsuario = await Medico.findOne({ email });

  if (existeUsuario) {
    const error = new Error("El email ya está registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const medico = new Medico(req.body);
    const medicoGuardado = await medico.save();

    await emailRegistro({
      email,
      nombre,
      token: medicoGuardado.token,
    });
    res.json(medicoGuardado);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al registrar el usuario" });
  }
};

const perfil = (req, res) => {
  const { medico } = req;
  res.json({ medico });
}

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Medico.findOne({ token });

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

  const usuario = await Medico.findOne({ email });

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

  const existeMedico = await Medico.findOne({ email });
  if (!existeMedico) {
    const error = new Error("El email no está registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeMedico.token = generarId();
    await existeMedico.save();

    emailOlvidePassword({
      email,
      nombre: existeMedico.nombre,
      token: existeMedico.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al enviar el email" });
  }
} 

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Medico.findOne({ token });
  if (!tokenValido) {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: "Token válido y el usuario existe" });

}

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const medico = await Medico.findOne({ token });
  if (!medico) {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }

  try {
    medico.token = null;
    medico.password = password;
    await medico.save();
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
    const medico = await Medico.findById(id);
    if (!medico) {
      const error = new Error("Médico no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if(medico.email !== email) {
      const existeEmail = await Medico.findOne({ email });
      if (existeEmail) {
        const error = new Error("Este email ya está en uso");
        return res.status(400).json({ msg: error.message });
      }
    }

    medico.nombre = nombre || medico.nombre;
    medico.email = email || medico.email;
    medico.telefono = telefono || medico.telefono;

    const medicoActualizado = await medico.save();
    res.json({ medico: medicoActualizado });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error al actualizar el perfil" });
  }
}

const actualizarPassword = async (req, res) => {
  const { id } = req.params;
  const { passwordActual, passwordNueva } = req.body;

  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      const error = new Error("Médico no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if (!await medico.comprobarPassword(passwordActual)) {
      const error = new Error("La contraseña actual es incorrecta");
      return res.status(403).json({ msg: error.message });
    }

    medico.password = passwordNueva;
    await medico.save();
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