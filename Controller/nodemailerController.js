const nodemailer = require('nodemailer');

const { jsPDF } =  require("jspdf");
const pdf = new jsPDF();

const transporter = nodemailer.createTransport({
    service: "outlook",
    maxConnections: 10,
    pool: true,
    host: "smtp.outlook.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
    }
}
);  //creating a transporter or intiliazing ...

exports.sendMails = async (req, res) => {

    try {

         let userData = []; // list of all the user containing the map of their mail and path of thier pdf file...

        requestData = req.body;
        users = requestData.apiData;
        
        users.forEach(user => {

            let userPdfPath = toPdf(user[4], user[2]);

            userData.push({ "userName": user[1], "userMail": user[2], "userPdfPath": userPdfPath });
            
        });

        let userIndex = 0;

        let interval;   //setIntervel variable
        interval = setInterval(function () {

            if (userIndex === userData.length - 1) {
                clearInterval(interval);
            }

            transporter.sendMail({
                from: process.env.EMAIL,
                to: userData[userIndex].userMail,
                subject: 'Regarding Id cards',
                text: 'Here is yours Id card.',
                attachments: [
                    {
                        filename: `${ userData[userIndex].userName}-ID-Card`,
                        path: userData[userIndex].userPdfPath,
                        contentType: 'application/pdf'
                    }]
            },
            )

            userIndex = userIndex + 1;

        }, 2000);

        res.send({ message: "Mail Delivered" });

    } catch (err) {
        console.log(err);
    }

}    //function for sending the mail via api/sendMails

function toPdf(imageUrl, userMail) {

    let base64image = imageUrl.split(';base64,').pop();

    const imgProps = pdf.getImageProperties(base64image);

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(base64image, "JPEG", 0, 0, pdfWidth, pdfHeight / 1.13);

    pdf.save(`./pdfFiles/${userMail}.pdf`);

    return `./pdfFiles/${userMail}.pdf`

}  //function for converting base64 to pdf file.
