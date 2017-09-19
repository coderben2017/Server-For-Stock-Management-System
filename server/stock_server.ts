import * as express from 'express';
import * as path from 'path';
import { Server } from 'ws';

/* 使用express框架 */
const app = express();

/* 静态资源路径配置 */
app.use('/', express.static(path.join(__dirname, '..', 'client')));

/* WebSocket请求处理 */
app.get('/api/stock', (request, response) => {
    let result = stocks;
    let params = request.query;
    if (params.name) {
        result = result.filter(stock => stock.name.indexOf(params.name) !== -1);
    }
    response.json(result);
});

app.get('/api/stock/:id', (request, response) => {
    response.json(stocks.find(stock => stock.id == request.params.id));
});

const server = app.listen(8000, 'localhost', () => {
   console.log('服务器已启动，地址是http://localhost:8000');
});


/* 消息数订阅 */
let subscriptions = new Set<any>();

const wsServer = new Server({port: 8085});
wsServer.on("connection", webSocket => {
    subscriptions.add(webSocket);
});

let messageCount = 0;

setInterval(() => {
    subscriptions.forEach(ws => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({messageCount: ++messageCount}));
        } else {
           subscriptions.delete(ws);
        }
    })
}, 3000);


/* 数据模型 */
export class Stock {
    constructor (
        public id: number,
        public name: string,
        public price: number,
        public rating: number,
        public description: string ,
        public categories: Array<string>) {
    }
}

const stocks: Stock[] = [
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