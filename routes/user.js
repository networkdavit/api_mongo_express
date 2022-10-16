function user_routes(app){
    const user_controller = require("../controllers/user_controller")

    app.post('/auth/register', user_controller.register)

    app.post('/auth/login', user_controller.login)

    app.get('/auth/user/confirm/:token', user_controller.confirm_email)
}

module.exports = {user_routes}
