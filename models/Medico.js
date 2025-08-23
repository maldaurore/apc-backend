import mongoose from 'mongoose';
import generarId from '../helpers/generarId.js';
import bcrypt from 'bcrypt';

const medicoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  telefono: {
    type: String,
    default: null,
    trim: true
  },
  web: {
    type: String,
    default: null,
    trim: true
  },
  token: {
    type: String,
    default: generarId()
  },
  confirmado: {
    type: Boolean,
    default: false,
  }
});

medicoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

medicoSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
}

const Medico = mongoose.model('Medico', medicoSchema);
export default Medico;