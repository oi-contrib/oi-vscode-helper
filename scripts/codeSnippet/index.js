const fs = require("fs");
const path = require("path");

// 唯一标识
const uniqueId = "oi-vscode-helper.codeSnippet";

module.exports = function () {

    // 读取
    let pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json")));

    /**
     * 第一步：删除已有的残留配置
     */

    // contributes.commands
    for (let i = pkgJson.contributes.commands.length - 1; i >= 0; i--) {
        let command = pkgJson.contributes.commands[i].command;
        if (command.startsWith(uniqueId)) {
            pkgJson.contributes.commands.splice(i, 1);
        }
    }

    // contributes.menus
    for (let menusKey in pkgJson.contributes.menus) {
        if (menusKey == uniqueId) {
            pkgJson.contributes.menus[menusKey] = [];
        } else if (menusKey.startsWith(uniqueId)) {
            delete pkgJson.contributes.menus[menusKey];
        }
    }

    // contributes.submenus
    for (let i = pkgJson.contributes.submenus.length - 1; i >= 0; i--) {
        let submenuId = pkgJson.contributes.submenus[i].id;
        if (submenuId.startsWith(uniqueId) && submenuId != uniqueId) {
            pkgJson.contributes.submenus.splice(i, 1);
        }
    }

    /**
     * 第二步：生成新的配置
     */

    let commands = []; // 记录命令生成前置数据
    (function listFolder(rootPath, parentMenu) {
        let subItems = fs.readdirSync(rootPath);
        for (let subItem of subItems) {
            let folderPath = path.join(rootPath, subItem);
            let indexPath = path.join(rootPath, subItem, "index.json");
            if (fs.lstatSync(folderPath).isDirectory() && fs.existsSync(indexPath)) {   // 文件夹且存在index.json文件

                let indexValue = JSON.parse(fs.readFileSync(indexPath));
                let indexId = parentMenu + "." + subItem;

                // 如果是叶子
                if (indexValue.file) {

                    // contributes.commands
                    pkgJson.contributes.commands.push({
                        "command": indexId,
                        "title": indexValue.label
                    });

                    // contributes.menus
                    pkgJson.contributes.menus[parentMenu].push({
                        "command": indexId
                    });

                    commands.push([indexId.replace(uniqueId + ".", ""), indexValue.file]);
                }

                // 如果是子菜单
                else {

                    // contributes.menus
                    pkgJson.contributes.menus[parentMenu].push({
                        "submenu": indexId
                    });
                    pkgJson.contributes.menus[indexId] = [];

                    // contributes.submenus
                    pkgJson.contributes.submenus.push({
                        "id": indexId,
                        "label": indexValue.label
                    });

                    listFolder(folderPath, indexId);
                }

            }
        }
    })(path.join(__dirname, "../../src/codeSnippet"), uniqueId);
    fs.writeFileSync(path.join(__dirname, "./commands.json"), JSON.stringify(commands, null, 2));

    // 写回
    fs.writeFileSync(path.join(__dirname, "../../package.json"), JSON.stringify(pkgJson, null, 2), {
        encoding: "utf-8"
    });
}