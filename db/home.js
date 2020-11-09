//操作数据库的逻辑
let mongoose = require('mongoose')
let {
    db_url
} = require('./config')

mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// 视屏接口
let movieSchema = new mongoose.Schema({
    username: String,
    nickname: String,
    video_describe: String,
    cover_url: String,
    video_url: String,
    dianzan: Array,
    pinglun: Array,
    zhuanfa: Array,
    is_dianzan: Array,
}, {
    collection: 'videodata'
})
let Videodata = mongoose.model('videodata', movieSchema)

// 将表暴露出去
module.exports = {
    Videodata, // 用户表
}