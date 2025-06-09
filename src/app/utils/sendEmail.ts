import multer from 'multer';
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'anamikaroyproma@gmail.com',
      pass: 'joej cypt ljwh espl',
    },
  });

  await transporter.sendMail({
    from: '"Message Sharing Community 👻" <gandibroy11@gmail.com>', // sender address
    to, // list of receivers
    subject: 'Reset your password within ten minutes!', // Subject line
    text: 'Hi! Reset your password!', // plain text body
    html, // html body
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
