const express = require('express');
let router = express.Router();
let admin = require('./loginregister/index')
let news = require('./news/index')
let home = require('./home/index')

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
// 关注回关
router.post('/setfollow', news.Setfollow)
// 获取粉丝
router.post('/allfans', news.Allfans)
// 获取关注
router.post('/allfollow', news.Allfollow)
// 
router.post('/cancelfollow', news.Cancelfollow)
// 首页视屏添加接口
router.post('/addvideo', home.AddVideo)
// 获取视屏
router.post('/allvideo', home.AllVideo)



module.exports = router