let {ipcRenderer,remote} = require("electron");
let fs = require("fs")

// 监听右键事件, 发送消息给主进程, 主进程渲染右键菜单
document.addEventListener("contextmenu",(e)=>{
    e.preventDefault();
    ipcRenderer.send("contextmenu");
})

let current_file = "";
let is_saved = true;

window.addEventListener("load",()=>{
    let text = document.querySelector("#text");
    text.addEventListener('input',()=>{
        if (is_saved) {
            document.title = "*  " + document.title
        }
        is_saved = false;
    })
})

// 监听主进程通过channel 发送过来的信息
ipcRenderer.on("action",(e,msg)=>{
    switch (msg) {
        case "open":{
            check_file()

            let text = document.querySelector("#text");

            // 弹出打开文本框
            let ret = remote.dialog.showOpenDialogSync({
                title: "请选择文件",
                filters:[
                    {
                        name: "all",
                        extensions: ["*"]
                    }
                ]
            })

            // 读取文件
            let value = ""
            if (ret && ret != [] && ret.length != 0) {
                let file_path = ret[0];
                value = fs.readFileSync(file_path);

                // 打开之后修改当前的文件
                current_file = file_path

                // 修改状态
                is_saved = true

                document.title = current_file
            }else {
                value = text.value
            }

            // 更改输入框内容
            text.value = value.toString();
            break
        }
        case "create":{
            check_file();
            let text = document.querySelector("#text");
            text.value = "";
            current_file = "";
            document.title = "*.txt"
            break
        }
        case "save":{
            save()

            // 重置保存状态
            // is_saved = true
            break
        }
        case "exit":{
            check_file()

            // 校验完毕, 提醒主进程退出
            ipcRenderer.send("app_exit")

            break
        }
    }
})


let check_file = () => {
    // 判断输入框中是否有文本
    let text = document.querySelector("#text");
    console.log(is_saved)
    // 如果有文本, 判断是否保存过和修改过, 弹出是否保存对话框
    if (text.value != '' && !is_saved) {
        let  idx = remote.dialog.showMessageBoxSync({
            title: "现文本是否保存",
            message: "您当前输入框内有文本,是否保存",
            buttons: ['yes', 'no']
        })
        if (idx == 0) {
            save()
        }

        // is_saved = true
    }
};

let save = () => {

    let file_path;
    console.log(current_file)
    // 判断当前修改的文件
    if (current_file == "") {
        file_path = remote.dialog.showSaveDialogSync({
            title: "请保存",
            defaultPath: "./"
        });
    } else {
        file_path = current_file
    }

    // 读取输入框文本
    let text = document.querySelector("#text");

    // 保存
    if (file_path && file_path != [] && file_path.length != 0) {
        fs.writeFileSync(file_path, text.value)
        current_file = file_path
        // 重置状态
        is_saved = true

        document.title = current_file
    }

};



