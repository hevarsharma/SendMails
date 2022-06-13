const nodemailer = require('nodemailer');

const { jsPDF } =  require("jspdf");
const pdf = new jsPDF();

const reader = require('xlsx');

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

        const files = req.file;
        if (!files) {
            return res.send({ error: 'Isuue from fetching the file' });
        }

        const filePath = files.path;

        const file = reader.readFile(filePath);

        const sheets = file.SheetNames    //from fatching path to get the sheet..

        let userData = []; // list of all the user containing the map of their mail and path of thier pdf file...

        for (let i = 0; i < sheets.length; i++) {

            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]]);
            temp.forEach(async (response) => {

                let userPdfPath = toPdf(response.image, response.email);

                userData.push({ "userName": response.name, "userMail": response.email, "userPdfPath": userPdfPath });

            });
        }

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
