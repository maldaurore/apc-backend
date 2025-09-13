import Cita from "../models/Cita.js";
import Paciente from "../models/Paciente.js";
import mongoose from 'mongoose';

const guardarCita = async (req, res) => {
  const { pacienteId, start, end, profesionalId } = req.body;

  try {
    const paciente = await Paciente.findById(new mongoose.Types.ObjectId(pacienteId.trim()));
    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    const nuevaCita = new Cita({
      pacienteId: paciente._id,
      title: paciente.nombre,
      start,
      end,
      profesional: req.profesional ? req.profesional._id : profesionalId,
    });

    await nuevaCita.save();
    res.status(201).json(nuevaCita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al guardar la cita" });
  }
}

const obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find().where('profesional').equals(req.profesional._id);
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las citas" });
  }
}

export {
  guardarCita,
  obtenerCitas
}