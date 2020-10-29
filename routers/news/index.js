const {
    Admin
} = require('../../db/user')

// 获取好友列表
exports.Getfriends = (req, res) => {
    let {
        username
    } = req.body
    Admin.find({
        username
    }).then((doc) => {
        let arr = []
        if (doc[0].friends.length == 0) {
            return res.json({
                code: 200,
                data: []
            })
        }
        // 获取好友列表
        for (let i = 0; i < doc[0].friends.length; i++) {
            Admin.findOne({
                username: doc[0].friends[i]
            }).then((docs) => {
                let obj = {
                    username: docs.username,
                    nickname: docs.nickname,
                    photourl: docs.photourl,
                    signature: docs.signature
                }
                arr.push(obj)
                if (arr.length == doc[0].friends.length) {
                    res.json({
                        code: 200,
                        data: arr
                    })
                }
            })
        }
    })
}