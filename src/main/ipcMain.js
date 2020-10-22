let {Menu,ipcMain, BrowserWindow,shell,dialog,app} = require("electron");
let fs = require('fs')

// 全局菜单
let template = [
    {
        label: '文件',
        submenu: [
            {
                label: '新建',
                click: function(){
                    BrowserWindow.getFocusedWindow().webContents.send("action","create")
                }
            },
            {
                label: '打开',
                click: function(){
                    // 通知渲染进程进行打开文件操作, 因为要操作dom修改文本框, 主进程里不方便操作
                    BrowserWindow.getFocusedWindow().webContents.send("action","open")
                }
            },
            {
                label: '保存',
                click: function(){
                BrowserWindow.getFocusedWindow().webContents.send("action","save")
                }
            },
            {
                label: '退出',
                click: function(){
                    // 退出之前, 发送信息给渲染进程提醒用户保存
                    BrowserWindow.getFocusedWindow().webContents.send("action","exit")
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                role: 'undo'
            },
            {
                label: '恢复',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {   label: '截切',
                role: 'cut'
            },
            {
                label: '复制',
                role: 'copy'
            },
            {
                label: '黏贴',
                role: 'paste'
            },

            {
                label: '删除',
                role: 'delete'
            },
            {
                label: '全选',
                role: 'editMenu'
            }
        ]
    },
    {
        label: '视图',
        submenu: [


            {
                label: '缩小',
                role: 'zoomin'
            },
            {   label: '放大',
                role: 'zoomout'
            },
            {   label: '重置缩放',
                role: 'resetzoom'
            },
            {
                type: 'separator'
            },
            {
                label: '全屏',
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: '帮助',
        submenu: [
            {
                label: '关于',
                click() {
                    shell.openExternal('https://www.mdzz.wiki');
                }
            }
        ]
    }
]

// 渲染全局菜单
let m = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(m);


// 右键菜单
let contextMenuTemplate=[
    {
        label: '撤销',
        role: 'undo'
    },
    {
        label: '恢复',
        role: 'redo'
    },
    {   label: '截切',
        role: 'cut'
    },
    {
        label: '复制',
        role: 'copy'
    },
    {
        label: '黏贴',
        role: 'paste'
    },
    { label: '全选',
        // role: 'selectall'
    }   //Select All菜单项
];

let contextMenu = Menu.buildFromTemplate(contextMenuTemplate)

// 监听 渲染进程发来的右键事件, 并渲染右键菜单
ipcMain.on("contextmenu",(e,msg)=>{
    contextMenu.popup(BrowserWindow.getFocusedWindow())
})

// 监听 渲染进程保存完毕之后需要退出程序
ipcMain.on("app_exit",(e,msg)=>{
    app.quit()
})

