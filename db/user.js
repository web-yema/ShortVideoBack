//操作数据库的逻辑
let mongoose = require('mongoose')
let {
  db_url
} = require('./config')
// connect里面的{ useNewUrlParser: true, useUnifiedTopology: true }必须加，否则不会报错但是有警告
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// 用户表 登录注册
let movieSchema = new mongoose.Schema({
  username: String,
  password: {
    type: String,
    required: true
  },
  nickname: String,
  photourl: String,
  signature: String,
  fans: Array, // 粉丝数
  follow: Array, // 关注数
  friends: Array, // 好友
  thumbs: Number // 点赞数
}, {
  collection: 'admin'
})
let Admin = mongoose.model('admin', movieSchema)







// 将表暴露出去
module.exports = {
  Admin, // 用户表
}