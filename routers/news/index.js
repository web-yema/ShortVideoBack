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

// fans 关注 follow 回关
exports.Setfollow = (req, res) => {

    function fns() {
        let {
            username,
            followusername
        } = req.body
        if (!username) {
            return res.json({
                code: 200,
                msg: '你的用户不存在'
            })
        }
        let ids = {
            [username]: 0
        }
        let isfriendsList = {
            [username]: {
                [username]: false,
                [followusername]: false
            }
        }
        // 我关注列表
        Admin.findOne({
            username
        }).then((doc) => {
            // 判断受否关注过此人
            let flagfans = doc.follow.includes(followusername)
            let fans = doc.fans.some(item => item == followusername);
            isfriendsList = {
                ...isfriendsList,
                [username]: {
                    ...isfriendsList[username],
                    [followusername]: fans
                }
            }
            if (flagfans) {
                ids = {
                    ...ids,
                    [username]: ids[username] + 1,
                }
                if (ids[username] == 2) {
                    res.json({
                        code: "400",
                        msg: "你已经关注过了"
                    })
                }
            } else {
                const datas = {
                    follow: [followusername, ...doc.follow],
                }
                update(username, datas)
                if (fans) {
                    const datas = {
                        friends: [followusername, ...doc.friends],
                    }
                    update(username, datas)
                }
            }
        })
        // 好友的粉丝列表
        Admin.findOne({
            username: followusername
        }).then((doc) => {
            // 判断受否关注过此人
            let flagfans = doc.fans.includes(username)
            let follos = doc.follow.some(item => item == username);
            isfriendsList = {
                ...isfriendsList,
                [username]: {
                    ...isfriendsList[username],
                    [username]: follos
                }
            }
            if (flagfans) {
                ids = {
                    ...ids,
                    [username]: ids[username] + 1,
                }
                if (ids[username] == 2) {
                    res.json({
                        code: "400",
                        msg: "你已经关注过了"
                    })
                }
            } else {
                const datas = {
                    fans: [username, ...doc.fans],
                }
                update(followusername, datas)

                if (follos) {
                    const datas = {
                        friends: [username, ...doc.friends],
                    }
                    update(followusername, datas)
                }
            }

        })

        function update(usernames, datas) {
            Admin.updateOne({
                username: usernames
            }, {
                $set: datas
            }).then(docs => {
                ids = {
                    ...ids,
                    [username]: ids[username] + 1,
                }
                let aa = isfriendsList[username]
                if (aa[username] && aa[followusername]) {
                    if (ids[username] == 4) {
                        res.json({
                            code: 200,
                            msg: '关注成功'
                        })
                    }
                } else {
                    if (ids[username] == 2) {
                        res.json({
                            code: 200,
                            msg: '关注成功'
                        })
                    }
                }

            })
        }
    }
    fns()
}


// 获取粉丝
exports.Allfans = (req, res) => {
    let {
        username
    } = req.body
    Admin.find({
        username
    }).then((doc) => {
        let arr = []
        if (doc[0].fans.length == 0) {
            return res.json({
                code: 200,
                data: []
            })
        }
        // 获取粉丝列表
        for (let i = 0; i < doc[0].fans.length; i++) {
            Admin.findOne({
                username: doc[0].fans[i]
            }).then((docs) => {
                let obj = JSON.parse(JSON.stringify(docs))
                delete obj.password
                arr.push(obj)
                if (arr.length == doc[0].fans.length) {
                    res.json({
                        code: 200,
                        data: arr
                    })
                }
            })
        }
    })
}

// 获取关注
exports.Allfollow = (req, res) => {
    let {
        username
    } = req.body
    Admin.find({
        username
    }).then((doc) => {
        let arr = []
        if (doc[0].follow.length == 0) {
            return res.json({
                code: 200,
                data: []
            })
        }
        // 获取粉丝列表
        for (let i = 0; i < doc[0].follow.length; i++) {
            Admin.findOne({
                username: doc[0].follow[i]
            }).then((docs) => {
                let obj = JSON.parse(JSON.stringify(docs))
                delete obj.password
                arr.push(obj)
                if (arr.length == doc[0].follow.length) {
                    res.json({
                        code: 200,
                        data: arr
                    })
                }
            })
        }
    })
}

// 取消关注

exports.Cancelfollow = (req, res) => {
    let {
        username,
        followusername
    } = req.body
    if (!username) {
        return res.json({
            code: 200,
            msg: '你的用户不存在'
        })
    }
    let ids = {
        [username]: 0
    }
    // 我关注列表
    Admin.findOne({
        username
    }).then((doc) => {
        // 判断受否关注过此人
        let follows = doc.follow.filter((item) => item !== followusername)
        let friendss = doc.friends.filter((item) => item !== followusername)
        const datas = {
            follow: follows,
            friends: friendss,
        }
        update(username, datas)

    })

    // 好友的粉丝列表
    Admin.findOne({
        username: followusername
    }).then((doc) => {

        // 判断受否关注过此人
        let fanss = doc.fans.filter((item) => item !== username)
        let friendss = doc.friends.filter((item) => item !== username)
        const datas = {
            fans: fanss,
            friends: friendss,
        }
        update(followusername, datas)
    })

    function update(usernames, datas) {
        Admin.updateOne({
            username: usernames
        }, {
            $set: datas
        }).then(docs => {
            ids = {
                ...ids,
                [username]: ids[username] + 1,
            }
            if (ids[username] == 2) {
                res.json({
                    code: 200,
                    msg: '取消成功'
                })
            }

        })
    }
}