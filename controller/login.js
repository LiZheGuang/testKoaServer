const jwt = require('jsonwebtoken');

let staticConfigs = require('../staticConfigs')

let user  = staticConfigs.userInfo

module.exports.loginPost = async function(ctx){
    console.log('post请求')
    console.log(ctx.request.body)
    let accounts = ctx.request.body.accounts
    let password = ctx.request.body.password
    if (user.userDB[0].accounts == accounts && user.userDB[0].password == password) {
        // 先判断是否有这个账号
        console.log('有这个账户')
        // 生成token
        let token = jwt.sign({
            name: accounts,
            password:password
        }, user.jwtPassword, { expiresIn: '2h' });

        ctx.cookies.set(
            'token', token, {
                // domain:'localhost', // 写cookie所在的域名
                path: '/',       // 写cookie所在的路径
                maxAge:  2*60*60*1000,   // cookie有效时长
                // expires: new Date(), // cookie失效时间
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            }
        )

        // 登陆成功直接跳转
        ctx.redirect('/')

    } else {
        // 登陆失败
        return ctx.body = {
            ok: false,
            message: '登录失败，没有此账号'
        }
    }
}