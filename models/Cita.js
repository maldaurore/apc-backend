import mongoose from 'mongoose';

const citaSchema = mongoose.Schema({
    pacienteId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
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

const Cita = mongoose.model("Cita", citaSchema);

export default Cita;