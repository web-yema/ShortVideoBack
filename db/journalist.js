//操作数据库的逻辑
let mongoose = require("mongoose");
let { db_url } = require("./config");
mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
// connect里面的{ useNewUrlParser: true, useUnifiedTopology: true }必须加，否则不会报错但是有警告
// 用户表
let getjournalism = new mongoose.Schema(
    {
        id: Number,
        title: String,
        videourl: String,
        user: String,
        time: String,
        text: String
    },
    { collection: "journalism" }
);
let Journalism = mongoose.model("journalism", getjournalism);



module.exports = {
    Journalism
};
