const express = require('express');
let router = express.Router();
let admin = require('./loginregister/index')
let news = require('./news/index')
let journalism = require('./journalism/index')

router.get('/', (req, res) => {
    res.json({
        code: 200
    });
})
// 注册
router.post('/register', admin.Register)
// 登录
router.post('/login', admin.Logins)
// 获取用户详情
router.post('/getadmin', admin.Getadmin)
// 获取好友列表
router.post('/getfriends', news.Getfriends)
// 获取新闻页
router.post('/getjournalism', journalism.Getjournalism)
// 添加新闻页
router.post('/addjournalism', journalism.Addjournalism)
module.exports = router