const nodeMailer = require("nodemailer");

const sendEmail = async(options)=>{ // options me email,subject,message aya h controller se

const transporter = nodeMailer.createTransport({
    host:process.env.SMTP_HOST,
    port: 465,
    secure:true, 
    auth:{                                           // run on mobile data
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    },
});

const mailOptions ={

     from: process.env.SMTP_MAIL,
     to: options.email,
     subject: options.subject,
     text: options.message,
};
try{
   await transporter.sendMail(mailOptions); //this will send mail
   console.log("Email sent successfully");
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email");
    }
};

 module.exports = sendEmail;