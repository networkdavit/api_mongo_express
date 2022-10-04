function user_routes(app){
    const user_controller = require("../controllers/user_controller")

    app.post('/auth/register', user_controller.register)

    app.post('/auth/login', user_controller.login)
}

module.exports = {user_routes}
