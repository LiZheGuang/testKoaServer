const KoaRouter = require('koa-router');
const koajwt = require('koa-jwt');
const istoken = require('./lib/authorization.js').isToken
const index = require('./controller/index').index
const login = require('./controller/login')

let staticConfigs = require('./staticConfigs')

let router = new KoaRouter();

global.userDB = [{
    accounts: 'admin',
    password: '123456'
}]

global.jwtPassword = 'a7161089'

router.get('/', async (ctx, next) => {

    let token = index(ctx)
    console.log(ctx)
     if(token){
        // 有toke
       await ctx.render('index', {
            title: '请求日志页',
            log:global.apiList
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
    login.loginPost(ctx)
})



router.get('/test',async (ctx,next)=>{
    console.log('执行了吗')
    ctx.body = {code:200}
})

router.get('/log', async (ctx, next) => {
    let title = 'Koa2'
    let apiList = global.apiList
    ctx.body = {
        code:200,
        log:apiList
    }
    console.log('log REQUIRE')
})

// 登出
router.post('/logout', koajwt({secret: jwtPassword}),async (ctx,next)=>{
    let token = await istoken(ctx,jwtPassword)
    ctx.body = {ok:true,message:'登出成功'}
    ctx.cookies.set('token','',{signed:false,maxAge:0})
})
// 删除用户
router.post('/deleteLog', koajwt({secret: jwtPassword}), async (ctx,next)=>{
   
    let token = await istoken(ctx,jwtPassword)
    let body = ctx.request.body
    let index = body.index
    console.log(token)
    global.apiList[index].delete = true
    // 校验token
    ctx.body = {ok:true,message:'登出成功'}
})

// userinfo
router.get('/user',async (ctx,next)=>{
    await ctx.render('user', {
        title: '个人中心页',
        data:staticConfigs.userInfo.infoData
    })
})
router.post('/userName',async (ctx,next)=>{
    console.log('修改名字')
    console.log(ctx.request.body.nickName);
    let nickName = ctx.request.body.nickName


    staticConfigs.userInfo.infoData.nickName = nickName
    ctx.redirect('/user')
})

Array.prototype.remove=function(dx)
{
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
        this[n++]=this[i]
        }
    }
    this.length-=1
　}

module.exports = router;