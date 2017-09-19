"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
/* 使用express框架 */
var app = express();
/* 静态资源路径配置 */
app.use('/', express.static(path.join(__dirname, '..', 'client')));
/* WebSocket请求处理 */
app.get('/api/stock', function (request, response) {
    var result = stocks;
    var params = request.query;
    if (params.name) {
        result = result.filter(function (stock) { return stock.name.indexOf(params.name) !== -1; });
    }
    response.json(result);
});
app.get('/api/stock/:id', function (request, response) {
    response.json(stocks.find(function (stock) { return stock.id == request.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log('服务器已启动，地址是http://localhost:8000');
});
/* 消息数订阅 */
var subscriptions = new Set();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (webSocket) {
    subscriptions.add(webSocket);
});
var messageCount = 0;
setInterval(function () {
    subscriptions.forEach(function (ws) {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({ messageCount: ++messageCount }));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 3000);
/* 数据模型 */
var Stock = (function () {
    function Stock(id, name, price, rating, description, categories) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.rating = rating;
        this.description = description;
        this.categories = categories;
    }
    return Stock;
}());
exports.Stock = Stock;
var stocks = [
    new Stock(1, '第一支股票', 1.99, 2.0, '第一支股票的描述。。。', ['互联网', '医疗']),
    new Stock(2, '第二支股票', 2.99, 3.5, '第二支股票的描述。。。', ['互联网', '教育']),
    new Stock(3, '第三支股票', 3.99, 4.5, '第三支股票的描述。。。', ['教育']),
    new Stock(4, '第四支股票', 4.99, 5.0, '第四支股票的描述。。。', ['医疗']),
    new Stock(5, '第五支股票', 5.99, 4.5, '第五支股票的描述。。。', ['医疗', '教育']),
    new Stock(6, '第六支股票', 6.99, 3.0, '第六支股票的描述。。。', ['教育']),
    new Stock(7, '第七支股票', 7.99, 3.5, '第七支股票的描述。。。', ['互联网']),
    new Stock(8, '第八支股票', 8.99, 3.0, '第八支股票的描述。。。', ['互联网', '医疗', '教育']),
    new Stock(9, '第九支股票', 9.99, 1.0, '第九支股票的描述。。。', ['互联网', '教育'])
];
