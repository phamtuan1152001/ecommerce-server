// set up send email
var nodemailer = require("nodemailer");
const USER_NAME_GMAIL = "petshopecommerce301@gmail.com";
const APP_PASSWORD_HARD_CODE = "oelntfgcqbaypmrg";

export const sendEmail = (content, userMail) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: USER_NAME_GMAIL,
      pass: APP_PASSWORD_HARD_CODE,
    },
  });
  var mailOptions = {
    from: "petshopecommerce301@gmail.com",
    to: userMail,
    subject: "Code Active Account",
    text: `Your code active account is ${code}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error", error);
      // res.send({
      //   retCode: 0,
      //   retText: "Send email unsuccessfully!",
      //   retData: null,
      // });
      return;
    } else {
      // res.send({
      //   retCode: 0,
      //   retText: "Send email successfully!",
      //   retData: null,
      // });
      // console.log("info", info);
      return;
    }
  });
}