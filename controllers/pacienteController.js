import Paciente from "../models/Paciente.js"

const agregarPaciente = async (req, res) => {
  const paciente = new Paciente(req.body);
  paciente.medico = req.medico._id;
  
  try {
    const pacienteGuardado = await paciente.save();
    res.json(pacienteGuardado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al agregar el paciente' });
  }
}

const obtenerPacientes = async (req, res) => {
  const pacientes = await Paciente.find().where('medico').equals(req.medico._id).sort({ createdAt: -1 });
  res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
  const { id } = req.params;

  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(404).json({ msg: 'Paciente no encontrado' });
  }

  if (paciente.medico.toString() !== req.medico._id.toString()) {
    return res.status(403).json({ msg: 'Acción no permitida' });
  }

  res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;

  let paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(404).json({ msg: 'Paciente no encontrado' });
  }

  if (paciente.medico.toString() !== req.medico._id.toString()) {
    return res.status(403).json({ msg: 'Acción no permitida' });
  }

  paciente = Object.assign(paciente, req.body);
  await paciente.save();

  res.json(paciente);
}

const eliminarPaciente = async (req, res) => {
  const { id } = req.params;

  let paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(404).json({ msg: 'Paciente no encontrado' });
  }

  if (paciente.medico.toString() !== req.medico._id.toString()) {
    return res.status(403).json({ msg: 'Acción no permitida' });
  }

  try {
    await paciente.deleteOne();
    return res.json({ msg: "Paciente eliminado" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error al eliminar el paciente' });
  }
  
}

const verificarEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'El correo electrónico es obligatorio' });
  }

  try {
    const paciente = await Paciente.findOne({ email });
    if (paciente) {
      return res.json(paciente);
    } else {
      return res.json(false);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error al verificar el correo electrónico' });
  }
}

export {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
  verificarEmail
}