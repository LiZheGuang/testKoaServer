module.exports.index = function(ctx){
     // ctx.router available
     let title = 'index'
     // 查询本地是否有token，
     let token = ctx.cookies.get('token')
     
     return token
}