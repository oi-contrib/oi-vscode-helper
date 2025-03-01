function openPage(pagename) {
    vscode.postMessage({
        type: "openPage",
        name: pagename
    });
}

// 绘制日历画笔
var painter = new VISLite.Canvas(document.getElementById("content-id"));
var size = painter.getInfo();

// 今天
var curDate = new Date();
var today = {
    year: curDate.getFullYear(),
    month: curDate.getMonth() + 1,
    day: curDate.getDate()
};

// 绘制日历方法
function updateCalendarView(year, month) {

    painter.config({
        lineWidth: 1,
        fillStyle: "#064d6c",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 800
    });

    var viewInfo = calcDaysArray(year, month); // 日历信息
    var left = 10, top = 50, width = size.width - left * 2, height = size.height - top - 30; // 尺寸信息

    var titleHeight = 20;
    var itemWidth = width / 7;
    var itemHeight = (height - 20) / 6;

    // 星期小标题
    for (var i = 0; i < 7; i++) {
        painter.fillText(["一", "二", "三", "四", "五", "六", "七"][i], left + (i + 0.5) * itemWidth, top + titleHeight * 0.5);
    }

    // 月份
    painter.config({
        fontSize: 20,
        textAlign: "right",
    }).fillText(["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"][month - 1] + "月", left + width, top * 0.5);

    // 年份
    painter.config({
        textAlign: "left",
        fontSize: 14
    }).fillText(year + "年", left, top + height + (size.height - top - height) * 0.5);

    // 日期
    painter.config({
        fontSize: 14,
        textAlign: "center"
    });
    var item;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            item = viewInfo[i * 7 + j];
            painter.config({
                fontWeight: item.type == "cur" ? 800 : 400,
                fillStyle: item.type == "cur" ? "#064d6c" : "#555555"
            });

            if (item.type == "cur") {
                painter.config({
                    fontWeight: 800,
                    fillStyle: "#064d6c"
                });

                // 今天
                if (year == today.year && month == today.month && item.value == today.day) {
                    painter.config({
                        fillStyle: "#064d6c"
                    }).fillCircle(left + (j + 0.5) * itemWidth, top + titleHeight + (i + 0.5) * itemHeight, Math.min(itemWidth, itemHeight) * 0.5).config({
                        fillStyle: "#ffffff"
                    });
                }
            }

            // 灰色的
            else {
                painter.config({
                    fontWeight: 400,
                    fillStyle: "#555555"
                });
            }

            painter.fillText(item.value, left + (j + 0.5) * itemWidth, top + titleHeight + (i + 0.5) * itemHeight);
        }
    }
}
updateCalendarView(today.year, today.month);

// 计算某月多少天
function calcDays(year, month) {

    if (month == 2) {

        if ((year % 4 != 0) || (year % 100 == 0 && year % 400 != 0)) {
            return 28;
        } else {
            return 29;
        }

    } else {
        return [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }

};

// 计算某月日历视图的天数组
function calcDaysArray(year, month) {

    // 0->周日 1->周一 ... 6->周六
    var index = new Date(year + '/' + month + '/1').getDay();

    // 前置多少天
    var preNum = index - 1;
    if (preNum == -1) preNum = 6;

    // 本月多少天
    var curNum = calcDays(year, month);

    // 后置多少天
    var nextNum = 42 - preNum - curNum;

    var daysArray = [];

    // 前置天数组
    var preMonthDays = calcDays(month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1);
    for (var i = preNum; i > 0; i--) {
        daysArray.push({
            type: "pre",
            value: preMonthDays - i + 1
        });
    }

    // 本月天数组
    for (var i = 1; i <= curNum; i++) {
        daysArray.push({
            type: "cur",
            value: i
        });
    }

    // 后置天数组
    for (var i = 1; i <= nextNum; i++) {
        daysArray.push({
            type: "next",
            value: i
        });
    }

    return daysArray;
};