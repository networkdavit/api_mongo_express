const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const user_model = require('../models/user_schema.js')
require('dotenv').config()

const SECRET = process.env.TOKEN_SECRET

const user_connection = user_model.user

function generateAccessToken(username) {
    return jwt.sign(username, SECRET, { expiresIn: '36000s' });
}

function register(app){
	app.post('/auth/register', async (req,res)=>{
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
        const token = generateAccessToken({ username: req.body.username });
		const new_user = new user_connection(added_user)
		new_user.save((err)=>{
		if(err){
			res.send(JSON.stringify({response: "Oops, something went wrong"}))
		}else{
			res.send(JSON.stringify({response: "Created", token: token}))
	}
    })
	
    })
}

function login(app){
	app.post('/auth/login', async (req,res)=>{
		const content = req.body 
		const email = content["email"]
        const password = content["password"]
        const token = generateAccessToken({ username: req.body.username });
        user_model.user.findOne({ email: req.body["email"]}, async function(err, user) {
            if (email == user.email && await bcrypt.compare(password, user.password)) {
                res.send(JSON.stringify({jwt_token: token}));
            } else {
                res.send(JSON.stringify({status: "Wrong credentials"}));
            }         
     });
    })
}

module.exports = {register, login}