const web3 = require("../utils/web3helper").getWeb3()


module.exports = {

    async transaction (ctx) {
        await ctx.render("transaction")
    },
    async Bitcoin(ctx){
        await ctx.render("bitcoinTran")
    },
    async Nav(ctx){
        await ctx.render("nav")
    },
    async List(ctx){
      await ctx.render("list")
    },
    async sendTransaction (ctx) {
        let returnResult = {
            code: 0,
            msg: '成功！',
            data: {},
            hs:""
        }
        
        const data = ctx.request.body

        const currentAccount = data.currAccount
        const privateKey = data.privateKey
        const reciptAccount = data.reciptAccount
        const txValue = data.txValue
        // 获取指定账户地址的交易数
        let nonce = await web3.eth.getTransactionCount(currentAccount);
        
        // 将 ether 转为 wei
        let value = web3.utils.toWei(txValue,'ether');
        
        // 获取当前gasprice
        let gasPrice = await web3.eth.getGasPrice();
        
        // 以太币转账参数    
        let txParms = {
            from: currentAccount,
            to: reciptAccount,
            nonce: nonce,
            gasPrice: gasPrice,
            data: '0x00', // 当使用代币转账或者合约调用时
            value: value // value 是转账金额
        }
        // 获取一下预估gas
        let gas = await web3.eth.estimateGas(txParms);
        txParms.gas = gas;
        // 用密钥对账单进行签名
        let signTx = await web3.eth.accounts.signTransaction(txParms,privateKey)

        // 将签过名的账单进行发送
        try {
            await web3.eth.sendSignedTransaction(signTx.rawTransaction, function(error,hash){
                console.log(hash);
                if (!error) {
                    returnResult.hs = hash
                    console.log("交易哈希值:"+returnResult.hs)
                    return returnResult.hs;
                } else {
                    returnResult.code = "101"
                    returnResult.msg = "失败！"
                    returnResult.data.error = error.message

                }
            })
        } catch (error) {
            console.log(error)
        }
        
        ctx.body = returnResult




    },
    async getTransFromHash(ctx) {
        let hash = this.state;
        let transaction;
        try {
            transaction = await web3.eth.getTransaction(hash);
        } catch (error) {
            console.info(JSON.stringify("catch error: " + JSON.stringify(error), null, 2), "\n ");
        }
        if (transaction) {
            this.setState({transactionInfo: transaction})
        }
        ctx.body = hash
    }
}