const RippleAPI = require('ripple-lib').RippleAPI;
const WebSocket = require('ws');
const ipaddress = "wss://s.altnet.rippletest.net:51233";//"wss://s-west.ripple.com"; //服务器是瑞波官方搭建
const instructions = {maxLedgerVersionOffset:5};
const INTERVAL = 1000;
const api = new RippleAPI({server:ipaddress});
const ratio = 0.000001;
const subTag = "Example watch Bitstamp's hot wallet/";

//创建XRP账户
//测试账户 r3Ph7QkqpiMXFm46mrU5EHSVQiuenVPSq4   sec:snR1tA8bU14FKgWy8RCt7i5xwkeVW
module.exports= {
    async createXrpAccount(ctx) {
        const generated = api.generateAddress()
        let accountInfo={"address":generated.address,"secret":generated.secret}
        ctx.body = accountInfo
        console.log(generated.address)
        console.log(generated.secret)
    },
    async sendXrp(ctx) {
        var apiPromise = api.connect().then(() => {
            console.log("开始连接!");
        });
        var balan = await api.getBalances('r3Ph7QkqpiMXFm46mrU5EHSVQiuenVPSq4')
        console.log(balan)
        ctx.body = balan
        var address = 'r3Ph7QkqpiMXFm46mrU5EHSVQiuenVPSq4';
        var pay={
            source:{
                address:'r3Ph7QkqpiMXFm46mrU5EHSVQiuenVPSq4',
                tag:3,
                maxAmount:{
                    value:1900,
                    currency:"XRP"
                }
            },
            destination:{
                address:"r4443d938F2oewXWPYYDDanDrKhs9Z8rGi",//接受地址
                tag:3,
                amount:{
                    value:1900,
                    currency:"XRP"
                }
            }
        };
        try {
            return api.preparePayment(address, pay, instructions).then(prepared => {
                api.getLedger().then(ledger => {
                    var ret = api.sign(prepared.txJSON, 'snR1tA8bU14FKgWy8RCt7i5xwkeVW');
                    return api.submit(ret.signedTransaction);
                });
            });
        }catch (e) {
            e.exception
        }
    }
}

