import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

const sender = {
  address: "hello@demomailtrap.co",
  name: "APC - Administrador de Pacientes y Citas"
}

const emailOlvidePassword = async (datos) => {
  const transport = Nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.MAILTRAP_TOKEN,
    })
  );

  const { email, nombre, token } = datos;

  const info = await transport.sendMail({
    from: sender,
    to: email,
    subject: "Restablece tu contraseña",
    text: `Restablece tu contraseña`,
    html: `<p>Hola: ${nombre}, has solicitado restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Restablecer Contraseña</a> </p>
      
      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`
  });

  console.log("Mensaje enviado: %s", info.messageId);
}

export default emailOlvidePassword