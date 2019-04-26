const web3 = require("../utils/web3helper").getWeb3()
const fileUtil = require('../utils/fileUtil')
const path = require('path');
const config = require("../config/config")
const myContract = require("../utils/web3helper").getContract()
const HTContract = require("../utils/web3helper").getHtContract()
const NexoContract = require("../utils/web3helper").getNexoContract()

module.exports = {
	async createAccount (ctx) {
        let returnResult = {
            code: 0,
            msg: '成功！',
            data: {}
        }
        
        let data = ctx.request.body
        const pwd = data.pwd

        // 调用 web3 创建账户
        let account = await web3.eth.accounts.create();

        // encrypt 返回一个JSON 对象
        const keystoreJson = await account.encrypt(pwd)
        
        // 将 JSON 对象转为字符串
        const keystoreStr = JSON.stringify(keystoreJson)

        // 生成随机文件存储 keystore 的字符串
        const randFilename = "UTC--"+new Date().toISOString()+"--"+account.address
        
        // 设置存储文件的目录
        const filePath =path.join(__dirname,"../public/keystore/"+randFilename)
        
        // 将 keystore 的内容写入文件中
        await fileUtil.writeFile(filePath,keystoreStr)
        
        // 将 用户地址、私钥、keystore 数据返回
        const result = {"account":account.address,"privateKey":account.privateKey,"keystore": config.keystoreUrl+randFilename}
        returnResult.data = result
        ctx.body = returnResult
    },
    async getAccountList (ctx) {
        await ctx.render("account")
    },
    async getAccountByPrivatekey(ctx) {

        let returnResult = {
            code: 0,
            msg: '成功！',
            data: {}
        }
        
        const data = ctx.request.body
        const privateKey = data.privateKey

        // 根据私钥获取用户地址
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)

        // 查询账户的余额
        const balance = await web3.eth.getBalance(account.address)
        const ethNum = web3.utils.fromWei(balance, 'ether')

        const tokenResult = await module.exports.getTokenBalance(account)

        returnResult.data.address = account.address
        returnResult.data.privateKey = account.privateKey
        returnResult.data.balance = ethNum
        returnResult.data.tokenBalance = tokenResult.balance
        returnResult.data.tokenSymbol = tokenResult.symbol
        ctx.body = returnResult
    },
    async getAccountByKeystore(ctx) {

        let returnResult = {
            code: 0,
            msg: '成功！',
            data: {}
        }
        
        const data = ctx.request.body;    // 获取上传文件

        const keystoreFile =  ctx.request.files.file
        const filePath = keystoreFile.path

        // 获取 keystore 里面的json字符串
        const keystoreStr = await fileUtil.readFile(filePath)

        // 获取账户的密码
        const password = data.password

        // 获取账户的信息地址及私钥
        const account = web3.eth.accounts.decrypt(keystoreStr,password)

        const balance = await web3.eth.getBalance(account.address)

        const ethNum = web3.utils.fromWei(balance, 'ether')

        const tokenResult = await module.exports.getTokenBalance(account)

        returnResult.data.address = account.address
        returnResult.data.privateKey = account.privateKey
        returnResult.data.balance = ethNum
        returnResult.data.tokenBalance = tokenResult.balance
        returnResult.data.tokenSymbol = tokenResult.symbol
        returnResult.data.HTbalance = tokenResult.HTbalance
        returnResult.data.HTsymbol = tokenResult.HTsymbol
        returnResult.data.NEXObalance = tokenResult.NEXObalance
        returnResult.data.NEXOsymbol = tokenResult.NEXOsymbol

        ctx.body = returnResult
    },

    async getTokenBalance(account){

        let returnResult = {
            balance: 0,
            symbol: 'banlace',
            HTbalance:0,
            HTsymbol:'',
            NEXObalance:0,
            NEXOsymbol:''
        }

        // 代币小数点位数
        const decimals = await myContract.methods.decimals().call()
        const symbol = await myContract.methods.symbol().call()
        const tokenBalance = await myContract.methods.balanceOf(account.address).call()
        const tokenBalanceNum = tokenBalance / Math.pow(10,decimals)

        //HT相关信息
        const HTdecimals = await HTContract.methods.decimals().call()
        const HTsymbol = await HTContract.methods.symbol().call()
        const HTtokenBalance = await HTContract.methods.balanceOf(account.address).call()
        const HTtokenBalanceNum = await HTtokenBalance/Math.pow(10,HTdecimals)

        //NEXO相关信息
        const NEXOdecimals = await NexoContract.methods.decimals().call()
        const NEXOsymbol = await NexoContract.methods.symbol().call()
        const NEXObalance = await NexoContract.methods.balanceOf(account.address).call()
        const NEXObalanceNum = await NEXObalance/Math.pow(10,NEXOdecimals)

        returnResult.HTbalance = HTtokenBalanceNum
        returnResult.HTsymbol = HTsymbol

        returnResult.balance = tokenBalanceNum
        returnResult.symbol = symbol

        returnResult.NEXOsymbol=NEXOsymbol
        returnResult.NEXObalance=NEXObalanceNum
        
       return returnResult

    }
}