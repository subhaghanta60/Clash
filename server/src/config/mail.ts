import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
   
    auth: {
      user:process.env.SMTP_USER ,
      pass: process.env.SMTP_PASSWORD ,
    },
  });





  export const sendEmail = async (to:string, subject:string,body:string) => {
     // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: body // html body
    });
    console.log(info);
  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>


}