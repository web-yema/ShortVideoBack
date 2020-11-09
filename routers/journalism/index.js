//新闻页
let { Journalism } = require("../../db/journalist");

//获取新闻
exports.Getjournalism = (req, res) => {
    let obj = {}
    if (req.body.id) {
        obj = {
            _id: req.body.id
        }
    } else {
        obj = {}
    }
    console.log(obj)
    Journalism.find(obj, (err, ret) => {
        if (err) {
            console.log(err);
        } else {
            if (ret) {
                res.json({
                    code: 200,
                    data: ret
                });
            } else {
                res.json({
                    code: 201,
                    msg: "没有更多"
                });
            }
        }
    });
}
//添加新闻
exports.Addjournalism = (req, res) => {
    console.log(req.body)
    let { title, videourl, user, text } = req.body;
    var journanew = new Journalism({
        title,
        videourl,
        user,
        time: new Date().getTime(),
        text
    })
    journanew.save(function (err, ress) {
        if (err) {
            return console.log(err)
        }
        console.log(ress)
        res.json({
            code: "200",
            message: '成功',
        })
    })
}

