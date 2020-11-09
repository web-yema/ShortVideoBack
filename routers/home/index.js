let {
    Videodata
} = require('../../db/home')
// 添加视屏接口
exports.AddVideo = (req, res) => {
    console.log()
    let {
        username,
        nickname,
        video_describe,
        cover_url,
        video_url,
    } = req.body
    // https://vd4.bdstatic.com/mda-kism5jdeyd2mdv54/sc/cae_h264_clips/1603332548/mda-kism5jdeyd2mdv54.mp4?auth_key=1604539088-0-0-ddeab17d99a64f65f2080c474187a5a3&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=8790_7
    var video = new Videodata({
        username,
        nickname,
        video_describe, // 视屏介绍
        cover_url, // 封面地址
        video_url,
        dianzan: [],
        pinglun: [],
        zhuanfa: [],
        is_dianzan: [],
    })
    video.save(function (err, ress) {
        if (err) {
            return console.log(err)
        }
        res.json({
            code: "200",
            message: '添加成功',
        })
    })
}

exports.AllVideo = (req, res) => {
    Videodata.find({}).then((doc) => {
        console.log(doc)
        res.json({
            code: 200,
            data: doc
        })
    })
}