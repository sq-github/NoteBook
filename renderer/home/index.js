// const { $ } = require('../helper.js')
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
// 加载本地数据库模块
const nedb = require('nedb');

// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
    filename: './NoteBookData/save.db',
    autoload: true
});
var add_win = false;
ipcRenderer.on('win-closed', () => {
    get_list();
    add_win = false;
})
$("#add").click(() => {
    if (!add_win) {
        ipcRenderer.send('add-plan');
        add_win = true;
    } else {
        // alert("focus");
        ipcRenderer.send('focus-win');
    }
})
$("#close").click(() => {
    ipcRenderer.send('close-main');
})
var is_list = false;
$("#lists").click(() => {
    get_list();
})


module.exports = {
    //显示主文本
    select: function (th) {
        // 加载本地数据库模块
        const nedb = require('nedb');

        // 实例化连接对象（不带参数默认为内存数据库）
        const db = new nedb({
            filename: './NoteBookData/save.db',
            autoload: true
        });
        var id = $(th).attr("dataid");
        db.findOne({
            _id: id
        }, (err, ret) => {
            if (err) {

            } else {
                var item = "";
                item += '<div id="mainTitle" class="pad_l10 pad_r10 pad_t10 h45 cor_white">' + ret.title + '</div>'
                item += '<textarea dataid="' + ret._id + '" class="pad_l10 pad_r10 pad_t10 cor_white" name="' + ret.content + '" id="mainText" cols="30" rows="10">' + ret.content + '</textarea>'
                // item += '<div class="pad_l10 pad_r10 pad_t10" name="'+title+'" id="mainText">' + ret.content + '</div>'
                $(".tab-content").html(item).show();
                $(".menu_lists").css("display", "none");
                $("#mainText").css("width", "300px");
                $(".save").css("display", "inline");
                is_list = false;
            }
        });
    },
    //获取左侧列表
    get_list: function () {
        // 加载本地数据库模块
        const nedb = require('nedb');

        // 实例化连接对象（不带参数默认为内存数据库）
        const db = new nedb({
            filename: './NoteBookData/save.db',
            autoload: true
        });
        if (!is_list) {
            db.find({
                name: "txt"
            }, (err, ret) => {
                // console.log(ret);
                if (err) { }
                else {
                    var item = "";
                    for (var i = 0; i < ret.length; i++) {
                        item += '<a class="nav-link" dataid="' + ret[i]._id + '" onclick="select(this)" data-toggle="pill" href="" role="tab" aria-controls="v-pills-home"><p onmouseover="scroll_start(this)" onmouseout="scroll_stop(this)">' + ret[i].title + '</p></a>'
                    }
                    $(".menu_lists").html(item).show();
                }
            });
            $(".menu_lists").css("display", "inline");
            $("#mainText").css("width", "220px");
            $("#mainText").css("height", "360px");
            $(".save").css("display", "none");
            is_list = true;
        } else {
            // db.find({
            //     name: "txt"
            // }, (err, ret) => {
            //         console.log(ret);
            //         if (err) { }
            //         else {
            //             var item = "";
            //             for (var i = 0; i < ret.length; i++) {
            //                 item += '<a class="nav-link" dataid="' + ret[i]._id + '" onclick="select(this)" data-toggle="pill" href="" role="tab" aria-controls="v-pills-home"><p onmouseover="scroll_start(this)" onmouseout="scroll_stop(this)">' + ret[i].title + '</p></a>'
            //             }
            //             $(".menu_lists").html(item);
            //         }
            //     });
            $(".menu_lists").css("display", "none");
            $("#mainText").css("height", "340px");
            $("#mainText").css("width", "300px");
            $(".save").css("display", "inline");
            is_list = false;
        }
    },
    scroll_start: function (th) {
        var wid = $(th).width();
        if (wid > 70) {
            $(th).addClass("scroll_text");
        }
    },
    scroll_stop: function (th) {
        $(th).removeClass("scroll_text");
    },
    save_color: function (cor) {
        var isCor = document.getElementById("mainpage").classList.contains("haveColor");
        if (!isCor) {
            db.insert(
                {
                    ColorName: "mainColor",
                    color: cor
                }
                , (err, ret) => {
                    if (err) { }
                    else {
                        document.getElementById("mainpage").classList.add("haveColor")
                        // alert("添加成功");
                    }
                });
        } else {
            db.update(
                {
                    ColorName: "mainColor",
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
};
//删除当前文本
$("#del").click(() => {
    // 加载本地数据库模块
    const nedb = require('nedb');
    // 实例化连接对象（不带参数默认为内存数据库）
    const db = new nedb({
        filename: './NoteBookData/save.db',
        autoload: true
    });
    var id = $("#mainText").attr("dataid");
    db.remove({
        _id: id
    }, (err, ret) => {
        if (err) { }
        else {
            document.getElementById("success_del").classList.replace("n_play", "show");
            get_list();
        }
    })
    setTimeout(() => {
        document.getElementById("success_del").classList.add("n_play");
    }, 1000);
})
//更新当前文本
$("#save").click(() => {
    var id = $("#mainText").attr("dataid");
    var content = $("#mainText").val();
    db.update({
        _id: id
    }, {
            $set: {
                content: String(content)
            }
        }, (err, ret) => {
            if (err) { }
            else {
                document.getElementById("success_save").classList.replace("n_play", "show");
                get_list();
            }
        });
    setTimeout(() => {
        document.getElementById("success_save").classList.add("n_play");
    }, 1000);
})
$("#cir_one").click(() => {
    // $(".page").css("background-color", "orangered");
    document.getElementById("mainpage").classList.add("gra_green")
    document.getElementById("mainpage").classList.remove("gra_orange")
    document.getElementById("mainpage").classList.remove("gra_black")
    save_color("gra_green");
})
$("#cir_two").click(() => {
    // $(".page").css("background-color", "black");
    document.getElementById("mainpage").classList.add("gra_orange")
    document.getElementById("mainpage").classList.remove("gra_green")
    document.getElementById("mainpage").classList.remove("gra_black")
    save_color("gra_orange");
})
$("#cir_three").click(() => {
    // $(".page").css("background-color", "gray");
    document.getElementById("mainpage").classList.add("gra_black")
    document.getElementById("mainpage").classList.remove("gra_green")
    document.getElementById("mainpage").classList.remove("gra_orange")
    save_color("gra_black");
    // $("#mainpage,textarea").css("color","white");
})
ipcRenderer.on('mainWin-open', () => {
    db.find({
        ColorName: "mainColor"
    }, (err, ret) => {
        if (err) {

        } else {
            console.log(ret);
            if (ret == "") {
                // alert("kongde");
            } else {
                var cor = ret[0].color;
                document.getElementById("mainpage").classList.add("haveColor");
                document.getElementById("mainpage").classList.add(cor);
            }
        }
    });
})

