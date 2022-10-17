const jwt_auth = require('../jwt/jwt_authenticate')

function post_routes(app){
    const post_controller = require("../controllers/post_controller")

    app.get('/posts', jwt_auth.authenticateToken ,post_controller.isConfirmedEmail, post_controller.get_all_posts)

    app.get('/posts/:id', jwt_auth.authenticateToken , post_controller.get_one_post)

    app.post('/posts',  jwt_auth.authenticateToken  ,post_controller.make_post)

    app.patch('/posts/:id', jwt_auth.authenticateToken , post_controller.update_one_post)

    app.delete('/posts/:id', jwt_auth.authenticateToken , post_controller.delete_one_post)

}

module.exports = {post_routes}