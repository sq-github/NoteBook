// const { $ } = require('../helper.js')
const { ipcRenderer } = require('electron')

$("#close").click(() => {
    // ipcRenderer.send('ref-win');
    ipcRenderer.send('close-add');
})
// 加载本地数据库模块
const nedb = require('nedb');

// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
    filename: './NoteBookData/save.db',
    autoload: true
});
//添加数据
$("#confirm").click(() => {
    var titles = $("#title").val();
    var contents = $("#content").val();
    // 插入单项
    if (titles) {
        db.insert(
            {
                name:"txt",
                title: titles,
                content: contents
            }
            , (err, ret) => {
                if (err) { }
                else {
                    ipcRenderer.send('close-add');
                    // ipcRenderer.send('ref-win');
                }
            });
    }
})

$("#cir_one").click(() => {
    // $(".page").css("background-color", "orangered");
    document.getElementById("addPage").classList.add("gra_blue")
    document.getElementById("addPage").classList.remove("gra_aqua")
    document.getElementById("addPage").classList.remove("gra_yellow")
    save_color("gra_blue");
})
$("#cir_two").click(() => {
    // $(".page").css("background-color", "black");
    document.getElementById("addPage").classList.add("gra_aqua")
    document.getElementById("addPage").classList.remove("gra_blue")
    document.getElementById("addPage").classList.remove("gra_yellow")
    save_color("gra_aqua");
})
$("#cir_three").click(() => {
    // $(".page").css("background-color", "gray");
    document.getElementById("addPage").classList.add("gra_yellow")
    document.getElementById("addPage").classList.remove("gra_aqua")
    document.getElementById("addPage").classList.remove("gra_blue")
    save_color("gra_yellow");
})
//监听打开事件
ipcRenderer.on('addWin-open', () => {
    db.find({
        addColorName: "addColor"
    }, (err, ret) => {
        if (err) {

        } else {
            if (ret == "") {
                // alert("kongde");
            } else {
                var cor = ret[0].color;
                // console.log(ret);
                document.getElementById("addPage").classList.add("haveColor");
                document.getElementById("addPage").classList.add(cor);
            }
        }
    });
})

module.exports = {
    save_color: function (cor) {
        var isCor = document.getElementById("addPage").classList.contains("haveColor");
        if (!isCor) {
            db.insert(
                {
                    addColorName: "addColor",
                    color: cor
                }
                , (err, ret) => {
                    if (err) { }
                    else {
                        document.getElementById("addPage").classList.add("haveColor")
                        // alert("添加成功");
                    }
                });
        } else {
            db.update(
                {
                    addColorName: "addColor",
                }, {
                    $set: {
                        color: cor
                    }
                }, (err, ret) => {
                    if (err) { }
                    else {
                        // alert("更新成功");
                    }
                });
        }
    }
}