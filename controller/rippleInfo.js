const RippleAPI = require('ripple-lib').RippleAPI;
const WebSocket = require('ws');
const ipaddress = "wss://s2.ripple.com:443";//"wss://s-west.ripple.com"; //服务器是瑞波官方搭建
const instructions = {maxLedgerVersionOffset:5};
const INTERVAL = 1000;
const api = new RippleAPI({server:ipaddress});
const ratio = 0.000001;
const subTag = "Example watch Bitstamp's hot wallet/";

//创建XRP账户
module.exports= {
    async createXrpAccount(ctx) {
        const generated = api.generateAddress()
        let accountInfo={"address":generated.address,"secret":generated.secret}
        ctx.body = accountInfo
        console.log(generated.address)
        console.log(generated.secret)
    }
}