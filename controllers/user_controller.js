const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const user_model = require('../models/user_schema.js')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const jwt_gen = require('../jwt/jwt_generate')
const email_confirm = require('../mailer/send_confirmation_email')


const SECRET = process.env.TOKEN_SECRET

const user_connection = user_model.user


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
        email_confirm.send_email(email, `http://localhost:6000/auth/user/confirm/${token}`)
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