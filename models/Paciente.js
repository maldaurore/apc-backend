import mongoose from 'mongoose';

const pacienteSchema = mongoose.Schema({
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profesional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profesional',
    },
  }, 
  {
    timestamps: true
  }
);

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;