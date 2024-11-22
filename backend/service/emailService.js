const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'singhpratima1703@gmail.com',
      pass: 'iugx tilq puze latq',
    },
  });

module.exports = {
    transporter
}