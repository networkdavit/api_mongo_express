function post_routes(app){
    const post_controller = require("../controllers/post_controller")

    app.get('/post',post_controller.authenticateToken, post_controller.get_all_posts)

    app.get('/post/:id',post_controller.authenticateToken, post_controller.get_one_post)

    app.post('/post', post_controller.make_post)
}

module.exports = {post_routes}