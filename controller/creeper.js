let request = require('request')

module.exports.creeperGet_awesomes = function(){
    let url = 'https://dayfront-api.awesomes.cn/topic/history?month=2018-'
    let  numbers = '08'
    let alwaysBody = []
    return new Promise((resove,reject)=>{
        function requestFn(numbers){
            request(url + numbers, function (error, response, body) {
                body = JSON.parse(body)
                if(error){
                    reject(error)
                }else{
                    if(!body.data || body.data.length < 1){
                        resove(alwaysBody)
                        return false
                    }else{
                        parseFloat(numbers)
                        numbers++
                        if(numbers < 10){
                            numbers = '0' + numbers
                        }
                        if(numbers > 12){
                            numbers = 1
                        }
                        alwaysBody.push(body.data)
                        requestFn(numbers)
                    }
                    
                }
              });
        }
        requestFn(numbers)

    })
 
}