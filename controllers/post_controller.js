const post_model = require('../models/post_schema.js')
const user_model = require('../models/user_schema.js')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const SECRET = process.env.TOKEN_SECRET


function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
  
	if (token == null) return res.sendStatus(401)
  
	jwt.verify(token, SECRET, (err, user) => {
	  if (err) return res.sendStatus(403)
  
	  req.user = user
  
	  next()
	})
  }


const post_collection = post_model.post

function get_all_posts(req, res){
		post_model.post.find({}, (err, posts)=> {
			if(err){
				res.send(JSON.stringify({response: "Oops, something went wrong"}))
			}
			else{
				res.send({posts: posts});
			}
		 });
}

function get_one_post(req, res){
		const id = req.params.id
		const identifier = req.body["identifier"]
		user_model.user.findOne({ identifier: identifier}, async (err, user)=> {
			if(err || user === null){
				res.send(JSON.stringify({response: "Oops, something went wrong"}))
			}
			else{
				post_model.post.findOne({id}, (err, post)=> {
					if(err || post === null){
						res.send(JSON.stringify({response: "Sorry, that post doesn't exist"}))
					}
					else if (user.identifier == identifier){
						res.send({post: post});
					}
					else{
						res.sendStatus(401)
					}
				});
			}
		})

}


function make_post(req, res){
		const content = req.body 
		const title = content["title"]
		const body = content["body"]
		const added_post ={
			title: title,
			body: body
		}
		const new_post = new post_collection(added_post)
		new_post.save((err)=>{
		if(err){
			res.send(JSON.stringify({response: "Oops, something went wrong"}))
		}else{
			res.send(JSON.stringify({response: "Created"}))
		}
		})
}

function update_one_post(req, res){
	const id = req.params.id
	const content = req.body 
	const title = content["title"]
	const body = content["body"]
	const modified_post ={
		title: title,
		body: body
	}
	console.log(modified_post)
	post_model.post.findOneAndUpdate(id, modified_post,(err, post)=>{
		if(err){
			res.send(JSON.stringify({response: "Oops, something went wrong"}))
		}
		else{
			res.send({response: "Successfully updated"});
		}
	})
}

function delete_one_post(req, res){
	const id = req.params.id
	post_model.post.findOneAndDelete({id},(err, post) =>{
		if(err){
			res.send(JSON.stringify({response: "Oops, something went wrong"}))
		}
		else{
			res.send({response: "Successfully deleted"});
		}
		});
}

module.exports =
	{
		make_post,get_all_posts,
		get_one_post, authenticateToken,
		delete_one_post, 
		update_one_post
	}