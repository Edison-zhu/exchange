const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;

const fullNode = new HttpProvider('https://api.shasta.trongrid.io')
const solidityNode = new HttpProvider('https://api.shasta.trongrid.io');
const eventServer = 'https://api.shasta.trongrid.io/';
const privateKey = '026f28872e3cec6375f94b12b68365ae35ed2cadc6dba1d15f167fe2489d9ff6';
const BigNumber = require('bignumber.js');

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);
module.exports={
    
    async createTrxAccount(ctx){
        let res={
            code:'',
            msg:'',
            data:{}
        }
        res.data = await tronWeb.createAccount()
        console.log(res.data.address)
        ctx.body = res
    },
    async sendTrx(ctx){
        const PrivateK = "026f28872e3cec6375f94b12b68365ae35ed2cadc6dba1d15f167fe2489d9ff6"
        const data = "TGW6YCPbnGf7CvHzHYtZjkvM67sDKgyotU"
        const accapt = ctx.request.body.accaptAccount
        const amount =tronWeb.fromSun(100)
        const value = BigNumber(amount * Math.pow(10,10));
        const balance = tronWeb.trx.getAccountResources("TBn25TFRx8fBJhVjKBmZYgdFL2TefNoAFi")
        console.log(balance)
        let parameter={
            PrivateK:PrivateK,
            data:data,
            accapt:accapt,
            amount:amount,
            balancess:""
        }
        try {
            await tronWeb.trx.sendTransaction(data, value,PrivateK,function (err,data) {
                let ban = tronWeb.trx.getBalance("TGW6YCPbnGf7CvHzHYtZjkvM67sDKgyotU");
                console.log(ban)
                parameter.balancess = ban
                if (!err){
                    console.log(ban)
                }
            });
        }catch (e) {
            e.exception
        }

        ctx.body = parameter.balancess


    }
}
