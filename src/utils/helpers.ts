import axios from 'axios';
import nodemailer from 'nodemailer'




function identityGenerator(count: number, padding: string) {
    var c = count + 1;
    var str = "" + c;
    var pad = "0000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    var m = new Date();
    var mm = m.getMonth() + 1;
    var yy = m.getFullYear();
    var dd = m.getDate();
    var theID = (padding + "" + yy + "" + mm + "" + dd + "" + ans);
    return theID
}




function randomString(length: number, chars: string) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('~') > -1) mask += '~!@*&$';
    var result = '';

    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result.toString();
}



function numberFormatter(num: any, digits = 1) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    if (num > 1)
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    else
        return num.toFixed(digits)
}


function generatePassword(length:number) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    return password;
  }

  function sendEmail(data: any) {
    var smtpTransport = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'chatbotaitecorb@gmail.com',
            pass: 'avgvbwlxkxhpqsww'
        }
    });
    var mailOptions = {
        to: data.email,
        from: "chatbotaitecorb@gmail.com",
        subject: data.subject,
       html:`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .wrapper {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin: 0 auto;
        }
        
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 15px;
            font-size: 24px;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .password {
            font-weight: bold;
            color: #d9534f;
            font-size: 18px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Welcome to Our Platform! 🎉
        </div>
        <div class="content">
            <p>Hi <strong>${data.name}</strong>,</p>
            <p>We are excited to have you on board! Your account has been successfully created.</p>
            <p>Your login details:</p>
            <p>Email: <strong>${data.email}</strong></p>
            <p>Password: <span class="password">${data.password}</span></p>
            <p>For security reasons, we recommend changing your password after your first login.</p>
            <p>Click below to log in:</p>
            <p><a href=${data.url} style="display:inline-block; padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">Login Now</a></p>
        </div>
        <div class="footer">
            If you didn’t sign up for this account, please ignore this email or contact support.<br>
            Thanks,<br>
            <strong>TecOrb Technologies Pvt. Ltd <br> Address: B52 Sector 63 Noida Uttar Pradesh 201301</strong>
        </div>
    </div>
</body>
</html>
`};

 smtpTransport.sendMail(mailOptions, function (err:any) {
        if (err) {
            console.log(err);
        }
    })
}

export {
    identityGenerator,
    randomString,
    numberFormatter,
    generatePassword,
    sendEmail
}