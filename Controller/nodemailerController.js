const nodemailer = require('nodemailer');

const path = require('path');

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
        let userPdfPath = toPng(user.image, user.email);

        mailOption = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Regarding Access cards",
            text: "Here is yours Access card.",
            attachments: [
                {
                    filename: 'Access-Card.png',
                    path: path.join(userPdfPath),
                },
            ],
        }

        transporter.sendMail(mailOption, function (err, info) {
            if (err) {
                res.send({code: 404, message:err});
            }
            else {
                res.send({code: 200, message:'Mail Delievered'});
            }
        });
    } catch (err) {
        console.log(err);
    }

}    //function for sending the mail via api/sendMails

function toPng(imageUrl, userMail) {

    let base64image = imageUrl.split(';base64,').pop();

    require("fs").writeFile(  `./pdfFiles/${userMail}.png`, base64image,{encoding:'base64'}, function (err) {
        console.log(err);
    });
    return `./pdfFiles/${userMail}.png`

}  //function for converting base64 to pdf file.
