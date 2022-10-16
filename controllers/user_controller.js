const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const user_model = require('../models/user_schema.js')
const nodemailer = require('nodemailer');
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const jwt_gen = require('../jwt/jwt_generate')


const SECRET = process.env.TOKEN_SECRET
const EMAIL_SENDER = process.env.EMAIL_SENDER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

const user_connection = user_model.user


function send_email(receiver_email, link){
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_SENDER,
      pass: EMAIL_PASSWORD
    }
    });
  
    const mailOptions = {
    from: EMAIL_SENDER,
    to: receiver_email,
    subject: 'Confirmation email',
    text: `Thank you for registering on our website, please confirm your email via the link ${link} `
    };
  
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    }); 
  }

async function register(req, res){
    const content = req.body 
    const username = content["username"]
    const email = content["email"]
    const salt = await bcrypt.genSalt(10)
    const password = content["password"]
    const hashed_password = await bcrypt.hash(password, salt)
    const added_user ={
        username: username,
        email: email,
        password: hashed_password
    }
    const new_user = new user_connection(added_user)
    new_user.save((err, user)=>{
    if(err){
        res.send(JSON.stringify({response: "Sorry, someone with that username or email already exists"}))
    }else{
        const token = jwt_gen.generateAccessToken({ email: email, id: user.id });
        send_email(email, `http://localhost:6000/auth/user/confirm/${token}`)
        res.send(JSON.stringify({response: "Created"}))
    }
    }) 
        
}

async function login(req, res){
    const content = req.body 
    const email = content["email"]
    const password = content["password"]
    user_model.user.findOne({ email: req.body["email"]}, async (err, user)=> {
        if(user == undefined){
            res.send(JSON.stringify({status: "Wrong credentials"}));
        }
        else if (email == user.email && await bcrypt.compare(password, user.password)) {
            const token = jwt_gen.generateAccessToken({ email: email, id: user.id });
            res.send(JSON.stringify({response: "Logged in", jwt_token: token}));
        } else {
            res.send(JSON.stringify({status: "Wrong credentials"}));
        }         
     });
}

async function confirm_email(req, res){
    const received_token = req.params.token
    jwt.verify(received_token, SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }else{
            const decoded_token = jwt_decode(received_token)
            const id = decoded_token.id
            const email = decoded_token.email
            user_model.user.findOne({ id: id, email: email}, async (err, user)=> {
                if(user == undefined){
                    res.send(JSON.stringify({status: "Possibly expired link"}));
                }
                else if (id == id) {
                    user.confirmed = true
                    user.save()
                    res.send(JSON.stringify({response: "Confirmed"}));   
                }
            })
        }
    })
}

module.exports = 
    {
        register, 
        login,
        confirm_email
    }