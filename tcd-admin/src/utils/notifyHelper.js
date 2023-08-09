const path = require('path')

const sendPush = async(deviceKey,pushMessage,tag=null,additionalData=null)=>{
    //console.log(deviceKey)
    var admin = require("firebase-admin");
    var filePath = path.resolve(__dirname, '../../tcdAccountKey.json')
    
    /**  */
    var serviceAccount = require(filePath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
        //databaseURL: "https://buildup-2428d.firebaseio.com"
    });
    /**  */
    var notifyTag = ''
    if(tag){
        notifyTag = tag
    }
    try{
        var payload = {
            data:{
                body:pushMessage,
                title:'TCD Application',
                tag:notifyTag,
                sound:'mysound', /* Default sound */
            },
            notification:{
                body:pushMessage,
                title:'TCD Application',
                tag:notifyTag,
                sound:'mysound', /* Default sound */
            }
        }
        var option = {
            priority:"high",
            timeToLive:60 * 60 * 24
        }
        const response = await admin.messaging().sendToDevice(deviceKey, payload, option)
        //console.log(JSON.stringify(response))
        if(response.successCount == 1){
            console.log(`Mesage with text ${pushMessage} Delivered SUccessfully`)
        }
        if(response.failureCount == 1){
            console.log(response.results)
        }
        
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    sendPush
}




