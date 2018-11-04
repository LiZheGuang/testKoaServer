
const Koa = require('koa');
const koaBody = require('koa-bodyparser');
const views = require('koa-views')
const koajwt = require('koa-jwt');

const static = require('koa-static')
const path  = require('path')
// 静态资源目录对于相对入口文件index.js的路径

const app = new Koa();
const router = require('./router.js')

const bodyParser = require('koa-bodyparser')

global.apiList = []

app.use(static(
  path.join(__dirname, './static')
))
// Authorization
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTU0MTMzMzkzMywiZXhwIjoxNTQxMzQxMTMzfQ.8t1kCBXYwl8UDuraYKp78352YH73pFobx8KGBe1xaDQ
app.use(async (ctx, next) => {
    let body = {
        creadTime: new Date(),
        header: ctx.header,
        // headers:ctx.headers,
        method: ctx.method,
        url: ctx.url,
        originalUrl: ctx.originalUrl,
        origin: ctx.origin,
        href: ctx.href,
        path: ctx.path,
        query: ctx.query,
        querystring: ctx.querystring,
        host: ctx.host,
        hostname: ctx.hostname,
        fresh: ctx.fresh,
        stale: ctx.stale,
        protocol: ctx.protocol,
        secure: ctx.secure,
        ip: ctx.ip,
        ips: ctx.ips,
        subdomains: ctx.subdomains,
        status: ctx.status
    }
    global.apiList.push(body)

    console.log(ctx)
    await next()
})



app.use(bodyParser())
// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}))




// 错误处理
app.use( async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
        return await next().catch((err) => {
            if(err.status === 401){
                ctx.status = 401;
                ctx.body = 'Protected resource, use Authorization header to get access\n';
            }else{
                throw err;
            }
        })
    }else{
        console.log('youde')
        await next()
    }
   
})

app.use(koajwt({
    secret: 'a7161089'
}).unless({
    path: [/^\/login/,/^\/index/]
}));

app.use(router.routes()).use(router.allowedMethods());


// 使用koa-bodyparser中间件
// app.on('error', (err, ctx) => {
//     // 报错
//     log.error('server error', err, ctx)
// });

app.listen(3000)


