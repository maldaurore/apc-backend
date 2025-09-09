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
    medico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medico',
    },
  }, 
  {
    timestamps: true
  }
);

const Cita = mongoose.model("Cita", citaSchema);

export default Cita;