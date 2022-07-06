const nodemailer = require('nodemailer');
const path = require('path');

const { jsPDF } = require("jspdf");
const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [8, 4.390]
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});  //creating a transporter or intiliazing ...

exports.sendMails = async (req, res) => {

    try {
        const user = req.body;
        let userPdfPath = toPdf(user.image, user.email);

        mailOption = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Regarding Access cards",
            text: "Here is yours Access card.",
            attachments: [
                {
                    filename: 'Access-Card.png',
                    path: userPdfPath,
                    contentType: "application/pdf",
                    encoding: "base64"
                },
            ],
        }

        transporter.sendMail(mailOption, function (err) {
            if (err) {
                res.send({ code: 404, message: err });
            }
            else {
                res.send({ code: 200, message: 'Mail Delievered' });
            }
        });
    } catch (err) {
        console.log(err);
    }

}    //function for sending the mail via api/sendMails

function toPdf(imageUrl, userMail) {

        let base64image = imageUrl.split(';base64,').pop();

        pdf.addImage(base64image, "JPEG", 0, 0);

        pdf.save(`./pdfFiles/${userMail}.pdf`);

        return `./pdfFiles/${userMail}.pdf`

}  //function for converting base64 to pdf file.
