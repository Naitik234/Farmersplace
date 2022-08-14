const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const nodemailer = require('nodemailer');

const { getMaxListeners } = require('process');
const otpModel = require('./models/otpModel');

require("./db/conn")
const RegisterCustomer = require("./models/registerCustomer");
const RegisterFarmer = require("./models/registerFarmer");

const static_path = path.join(__dirname, '../../');
app.use(express.static(static_path))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
})

app.post("/registerCustomer", async (req, res) => {
    try {
        const customer = new RegisterCustomer(req.body);

        if (customer.Password != customer.ConfirmPassword) {
            res.status(400).send("Password and Confirm Password do not match")
        }
        else {
            await customer.save().then(() => {
                res.sendFile('login.html', { root: static_path });
            }).catch((err) => {
                console.log(err)
                res.status(400).send(err)
            })
        }
    }
    catch (err) {
        res.status(400).send(err)
    }
})
app.post("/registerFarmer", async (req, res) => {
    try {
        const farmer = new RegisterFarmer(req.body);
        // console.log(farmer.Email)
        // console.log(farmer.Password)
        if (farmer.Password != farmer.ConfirmPassword) {
            res.status(400).send("Password and Confirm Password do not match")
        }
        else {
            await farmer.save().then(() => {
                res.sendFile('login.html', { root: static_path });
            }).catch((err) => {
                console.log(err)
                res.status(400).send(err)
            })
        }
    }
    catch (err) {
        res.status(400).send(err)
    }
})
app.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const customer = await RegisterCustomer.findOne({ Email: Email });
        const farmer = await RegisterFarmer.findOne({ Email: Email });
        if (customer) {
            if (customer.Password == Password) {
                res.sendFile('index.html', { root: static_path });
            }
            else {
                res.status(400).send("Password is incorrect")
            }
        }
        else if (farmer) {
            if (farmer.Password == Password) {
                res.sendFile('index.html', { root: static_path });
            }
            else {
                res.status(400).send("Password is incorrect")
            }
        }
        else {
            res.status(400).send("Email not registered")
        }
    }
    catch (err) {
        res.status(400).send(err)
    }
})
app.post("/sendotp", async (req, res) => {
    // console.log("inside send otp")
    // console.log(req.body.Email)

    const code = Math.floor(Math.random() * 10000) + 1;

    // console.log(code)
    try {
        const data = await RegisterFarmer.findOne({ Email: req.body.Email });
        // console.log(customer)
        // console.log(data)

        if (data) {
            await otpModel.deleteMany({ Email: req.body.Email }).then(() => {
                var addotp = new otpModel({
                    Email: req.body.Email,
                    code: code,
                    expiresIn: new Date().getTime() + 600000
                })
                addotp.save().then(() => {
                    mailer(req.body.Email, code)
                    res.sendFile('loginotp.html', { root: static_path });

                })
            })
        }
        else {
            res.status(404).send('email not registered');
        }
    }
    catch (err) {
        res.status(400).send(err.toString())
    }

})
app.post("/verifyotp", async (req, res) => {
    try {
        const { Email, Code, Password, ConfirmPassword } = req.body;
        const data = await otpModel.findOne({ Email: Email });
        console.log(data)
        if (data) {
            if (data.code == Code) {
                if (Password == ConfirmPassword) {
                    const userdata = await RegisterFarmer.findOne({ Email: Email });
                    userdata.Password = Password;
                    userdata.ConfirmPassword = ConfirmPassword;
                    userdata.save().then(() => {
                        res.sendFile('login.html', { root: static_path });
                    }).catch((err) => {
                        console.log(err)
                        res.status(400).send(err)
                    })
                }
                // res.sendFile('login.html', { root: static_path });
            }
            else {
                res.status(400).send("OTP is incorrect")
            }
        }
        else {
            res.status(400).send("OTP is incorrect")
        }
    }
    catch (err) {
        res.status(400).send(err)
    }
})
app.listen(port, () => {
    // console.log(static_path)
    console.log('Backend app listening on port 3000!');
})

const mailer = (email, otp) => {
    console.log(otp);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'farmerplace4@gmail.com',
            pass: 'hkxuunbmrnxdjylw',
        }
    });

    var mailOptions = {
        from: 'naitiksharma534@gmail.com',
        to: email,
        subject: 'Farmers Place: ' + otp + ' is your verification code for secure registration',
        html: '<h4>Hi User</h4> <h4>Greetings!</h4> <h4>You are just a step away to chnage your password successfully.</h4>'
            + ' <h4>We are sharing verification code that is valid for 10 minutes. Please confiirm the same to continue the process.</h4>'
            + ` <h4>Your OTP: ${otp}</h4>`
            + ` <h4>Expires in: 10 Minutes</h4>`
            + ' <h4>Best Regards</h4>'
            + ' <h4>Team Farmers Place</h4>'
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            
            console.log('Email sent: ' + info.response);
        }
    });
}