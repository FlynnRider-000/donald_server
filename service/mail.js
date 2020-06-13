const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "www.ds-enterprise.de",
    port: 465,
    secure: true,
    auth: {
        user:'_mainaccount@ds-enterprise.de',
        pass:'ucqgDqtERyN9'
    },
	tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;