var app = require('express')();
var http = require('http').createServer(app);
const path = require("path");
var io = require('socket.io')(http);
var express = require('express')
const cors = require('cors')
const router = require("./routers/index");
const bodyParser = require("body-parser");
const {
    Admin
} = require("./db/user");
const _ = require('underscore');
const moment = require('moment');
//设置静目录
// 设置静态资源目录
app.use(express.static(path.resolve("./public")));

// 挂载参数处理中间件 处理json格式的参数
app.use(bodyParser.json());
//解决跨域问题
app.use(cors());
// 安装路由
app.use(router);

//socket连接状态
const USER_STATUS = ['ONLINE', 'OFFLINE'];
const users = {};
// const offlineLst = {}
const lineLst = {}

io.on('connection', (socket) => {
    // 存储用户 socket.id
    socket.on('online', username => {
        users[username] = {
            socketId: socket.id,
            status: USER_STATUS[0]
        };
    })

    //将收到的消息广播出去
    socket.on('sendMessage', function (content) {
        // console.log(content); //content为收到的消息内容，包括姓名和消息内容
        // 在这里进行数据库读取
        socket.broadcast.emit('getMessage', content);
    });

    // 互关或取消关注
    socket.on('friends', function (content) {
        let {
            followusername
        } = content

        // console.log(content); //content为收到的消息内容，包括姓名和消息内容
        console.log(users[followusername])
        // 在这里进行数据库读取
        // socket.broadcast.emit('getFriends', content);
        if (users[followusername]) {
            socket.to(users[content.followusername].socketId).emit('getFriends');
        }

    });

    // //监听新人连接，然后广播出去
    // socket.on('newChart', function (name) {
    //     // console.log(name) //name为连接者的姓名或昵称
    //     // 在这里进行数据库存储

    // });

    // 存储函数
    function soList(params) {
        if (!lineLst[params.username]) {
            lineLst[params.username] = {}
        }
        if (!lineLst[params.receiver]) {
            lineLst[params.receiver] = {}
        }
        if (!lineLst[params.username][params.receiver]) {
            lineLst[params.username][params.receiver] = []
        }
        if (!lineLst[params.receiver][params.username]) {
            lineLst[params.receiver][params.username] = []
        }
        lineLst[params.username][params.receiver] = [...lineLst[params.username][params.receiver], params]
        lineLst[params.receiver][params.username] = [...lineLst[params.receiver][params.username], params]
    }
    // 实现私聊功能
    socket.on('private_chat', (params, fn) => {
        const receiver = users[params.receiver];
        params.createTime = moment().format('YYYY-MM-DD HH:mm:ss');

        if (receiver && receiver.status === USER_STATUS[0]) {
            // 在线处理
            soList(params)

            socket.to(users[params.receiver].socketId).emit('reply_private_chat', params);
            // 消息提示
            socket.to(users[params.receiver].socketId).emit('newChart', params);
        } else {
            // 可以在做些离线消息推送处理
            soList(params)
            console.log(`${params.receiver} 不在线`);
        }
    })
});

// 获取历史记录
app.post('/getmessage', (req, res) => {
    let {
        username,
        receiver
    } = req.body
    Admin.find({
        username: receiver
    }).then((data) => {
        let datas = data[0]
        console.log(lineLst[username])
        if (lineLst[username]) {
            res.json({
                code: 200,
                data: lineLst[username][receiver],
                mage: {
                    username: datas.username,
                    nickname: datas.nickname,
                    photourl: datas.photourl,
                    signature: datas.signature
                }
            })
        } else {
            res.json({
                code: 200,
                data: []
            })
        }
    })

})


http.listen(3031, () => {
    console.log('listening on *:3031');
});