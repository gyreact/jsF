/*backtest
start: 2019-07-18 00:00:00
end: 2019-08-17 00:00:00
period: 1h
*/

var buyOredreIds = [];
var initaccount = exchange.GetAccount();

function GetTicker() {

    var ticker = exchange.GetTicker();
}

function GetAccountBalance() {
    var account = exchange.GetAccount();
    //Log("账户信息，Balance:", account.Balance, "FrozenBalance:", account.FrozenBalance, "Stocks:",
    //   account.Stocks, "FrozenStocks:", account.FrozenStocks);
    if (account) {
            return account.Balance;
    }
    return 0;
}

function loginfoAccount() {

    var account2 = exchange.GetAccount();
    var balances = '初始总资产:' + initaccount.Balance;
    //获取当前交易对
    var exchangeParty = exchange.GetCurrency();
    var partyArr = exchangeParty.split("_");
    var log22 = "当前交易对:" + exchange.GetCurrency();
    var log33 = "账户信息，可用" + partyArr[1] + ":" + account2.Balance + "\n冻结余额:" + account2.FrozenBalance + "\n可用" + partyArr[0] + ":" + account2.Stocks + "\n冻结:" + account2.FrozenStocks;

    var table = {
        type: 'table',
        title: '账户交易对信息',
        cols: [''],
        rows: []
    }
    table.rows.push([balances])
    table.rows.push([log22])
    table.rows.push([log33])
    LogStatus('`' + JSON.stringify(table) + '`')

}
//下单 取消
function orderType(type, price, orderId) {

    //买
    if (type == "Buy") {

        var blance = GetAccountBalance();
        var bool = (blance >= (price * Amount));
        if (bool) {
            var ids = exchange.Buy(price, Amount);
            if (ids) {
                buyOredreIds.push(ids);
                var newPrice = price - 0.0001;
                orderType("Buy", newPrice, Amount);
            } else {
                orderType("Buy", price, Amount);

            }


        } else {
            var blance2 = GetAccountBalance();
            var canBuyAmout = blance2 / price;
            if (canBuyAmout >= limitAmuount) {
                var id2 = exchange.Buy(price, parseFloat((canBuyAmout - 1).toFixed(2)));
                if (id2) {
                    buyOredreIds.push(id2);
                }
                //   Sleep(1000);
                //   for (var i = 0; i < buyOredreIds.length; i++) {
                //      exchange.CancelOrder(buyOredreIds[i]);
                //   }
                //   buyOredreIds.splice(0, buyOredreIds.length);
            }


            Sleep(1000);
            for (var j = 0; j < buyOredreIds.length; j++) {
                exchange.CancelOrder(buyOredreIds[j]);
            }
            buyOredreIds.splice(0, buyOredreIds.length);
            loginfoAccount();


        }

        //取消
    } else if (type == "Cancle") {

        //卖
    } else {

    }

}


function GetDepth(type) {

    //获取市场订单价格深度
    var depth = exchange.GetDepth();
    //Asks 卖单价格
    var sellPrice = depth.Asks[3].Price;
    //Bids 买单价格
    var buyPrice = depth.Bids[4].Price;
    if (type == "Buy") {
        orderType("Buy", buyPrice);
    } else {
        var account = exchange.GetAccount();
        exchange.Sell(sellPrice, parseFloat(account.Stocks.toFixed(2)));
    }

}



function main() {


    //var info = balanceAccount["info"]["data"];
    //获取当前所有订单并取消
    var orders = exchange.GetOrders();
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].Type == 0) {
            exchange.CancelOrder(orders[i].Id);
        }
    }

    while (1) {
        // var sell = priceSell[0].sell;
        //  GetTicker();
        var account = exchange.GetAccount();
        if (account) {
            if (account.Stocks < limitAmuount) {
                GetDepth("Buy");

            } else {
                GetDepth("111");
            }
        }

    }


}
