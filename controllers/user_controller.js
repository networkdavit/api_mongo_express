const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const user_model = require('../models/user_schema.js')
const crypto = require('crypto');
require('dotenv').config()

const SECRET = process.env.TOKEN_SECRET

const EMAIL_SECRET = process.env.EMAIL_SECRET

const user_connection = user_model.user


function generateAccessToken(email) {
    return jwt.sign(email, SECRET, { expiresIn: '36000s' });
}

async function register(req, res){
		const content = req.body 
		const username = content["username"]
		const email = content["email"]
        const salt = await bcrypt.genSalt(10)
        const password = content["password"]
        const hashed_password = await bcrypt.hash(password, salt)
        const email_identifier = crypto.createHash('sha256').update(email+EMAIL_SECRET).digest('hex')
		const added_user ={
			username: username,
			email: email,
            identifier: email_identifier,
            password: hashed_password
		}
        user_model.user.find({ email: req.body["email"], username: req.body["username"]}, async (err, user)=> {
            if(!user) {
                const token = generateAccessToken({ email: email });
                const new_user = new user_connection(added_user)
                new_user.save((err)=>{
                if(err){
                    res.send(JSON.stringify({response: "Oops, something went wrong"}))
                }else{
                    res.send(JSON.stringify({response: "Created", identifier: email_identifier, token: token}))
                }
                }) 
            }
            else{
                res.send(JSON.stringify({status: "User with that username or email already exists"}))
            }
        });
}

async function login(req, res){
		const content = req.body 
		const email = content["email"]
        const password = content["password"]
        const token = generateAccessToken({ email: req.body.username });
        user_model.user.findOne({ email: req.body["email"]}, async (err, user)=> {
            if(user == undefined){
                res.send(JSON.stringify({status: "Wrong credentials"}));
            }
            else if (email == user.email && await bcrypt.compare(password, user.password)) {
                res.send(JSON.stringify({response: "Logged in", identifier: identifier, jwt_token: token}));
            } else {
                res.send(JSON.stringify({status: "Wrong credentials"}));
            }         
     });
}

module.exports = 
    {
        register, 
        login
    }