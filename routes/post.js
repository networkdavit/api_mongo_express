const jwt_auth = require('../jwt/jwt_authenticate')

function post_routes(app){
    const post_controller = require("../controllers/post_controller")

    app.get('/post', jwt_auth.authenticateToken ,post_controller.isConfirmedEmail, post_controller.get_all_posts)

    app.get('/post/:id', jwt_auth.authenticateToken , post_controller.get_one_post)

    app.post('/post',  jwt_auth.authenticateToken  ,post_controller.make_post)

    app.patch('/post/:id', jwt_auth.authenticateToken , post_controller.update_one_post)

    app.delete('/post/:id', jwt_auth.authenticateToken , post_controller.delete_one_post)

}

module.exports = {post_routes}