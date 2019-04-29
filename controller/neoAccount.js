var neonJs = require('@cityofzion/neon-js')
var { tx, wallet, settings }  = require("@cityofzion/neon-core");

module.exports= {

async createNeoAccount(ctx){
    const acct = new wallet.Account();
    const address = acct.address
    console.log(address)
    ctx.body = address
}
}
