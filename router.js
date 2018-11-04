const KoaRouter = require('koa-router');

const jwt = require('jsonwebtoken');

const koajwt = require('koa-jwt');

let router = new KoaRouter();



let userDB = [{
    accounts: 'admin',
    password: '123456'
}]

let jwtPassword = 'a7161089'

router.get('/index', async (ctx, next) => {
    // ctx.router available
    let title = 'index'
    // 查询本地是否有token，
    let token = ctx.cookies.get('token')
    if(token){
        // 有token
        await ctx.render('index', {
            title: title
        })
    }else{
        ctx.redirect('/login')
    } 
});


router.get('/login', async (ctx, next) => {

    await ctx.render('login', {
        title: 'login'
    })
}).post('/login', async (ctx, next) => {
    console.log('post请求')
    console.log(ctx.request.body)
    let accounts = ctx.request.body.accounts
    let password = ctx.request.body.password
    function genID(length) {
        return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    }
    console.log(userDB[0].accounts == accounts && userDB[0].password == password)



    if (userDB[0].accounts == accounts && userDB[0].password == password) {
        // 先判断是否有这个账号
        console.log('有这个账户')
        // 生成token
        let token = jwt.sign({
            name: accounts,
            password:password
        }, jwtPassword, { expiresIn: '2h' });

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
        ctx.redirect('/index')


    } else {
        // 登陆失败
        return ctx.body = {
            ok: false,
            message: 'not accounts'
        }
    }



})

// 登出
router.post('/logout',async (ctx,next)=>{
    console.log(ctx.request.body)
    let body =  ctx.request.body 
    
})

router.get('/test',async (ctx,next)=>{
    console.log('test')
    
    // let body =  ctx.request.body 
    // let token = ctx.get.cookies('token')
    // console.log(token)
    console.log('执行了吗')
    ctx.body = {code:200}
})

router.get('/user',async (ctx,next)=>{
    let body =  ctx.request.body 
    console.log('执行了吗')
    ctx.body = {code:200}
})



router.get('/log', async (ctx, next) => {
    let title = 'Koa2'
    let apiList = global.apiList
    await ctx.render('log', {
        title: title
    })
})


module.exports = router;