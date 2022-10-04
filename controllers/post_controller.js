const post_model = require('../models/post_schema.js')


const post_collection = post_model.post

function get_all_posts(app){
	app.get('/post', (req, res)=>{
		post_model.post.find({}, function(err, users) {
			if(err){
				res.send(JSON.stringify({response: "Oops, something went wrong"}))
			}
			else{
				res.send({users: users});
			}
		 });
	})
}

function make_post(app){
	app.post('/post', (req,res)=>{
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
	
    })
}

module.exports = {make_post,get_all_posts}