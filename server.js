
const Koa = require('koa');
const views = require('koa-views')
const static = require('koa-static')
const path  = require('path')
const os = require('os');
const fs = require('fs');
// let bodyParser = require('koa-body');
const app = new Koa();
const router = require('./router.js')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser') 

global.apiList = []
  
app.use(bodyParser());

app.use(static(
  path.join(__dirname, './static')
))

app.use(logger((str, args) => {

    console.log(str)
}))

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
        querystring: ctx.querystring,
        host: ctx.host,
        hostname: ctx.hostname,
        fresh: ctx.fresh,
        stale: ctx.stale,
        protocol: ctx.protocol,
        secure: ctx.secure,
        ip: ctx.ip,
        ips: ctx.ips,
        status: ctx.status
    }
    console.log('logUser1')
    await next()
    body.status = ctx.status;
    global.apiList.push(body)

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
        await next()
    }
   
})

app.use(router.routes()).use(router.allowedMethods());


app.listen(3000)


