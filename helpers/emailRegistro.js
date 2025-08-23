import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

const sender = {
  address: "hello@demomailtrap.co",
  name: "APC - Administrador de Pacientes y Citas"
}

const emailRegistro = async (datos) => {
  const transport = Nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.MAILTRAP_TOKEN,
    })
  );

  const { email, nombre, token } = datos;

  const info = await transport.sendMail({
    from: sender,
    to: email,
    subject: "Confirma tu cuenta en APC",
    text: `Hola ${nombre}, confirma tu cuenta en APC`,
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
      <p>Tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace:
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}" >Comprobar Cuenta</a> </p>
      
      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`
  });

  console.log("Mensaje enviado: %s", info.messageId);
}

export default emailRegistro