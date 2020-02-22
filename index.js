const https = require('https')
const http = require('http')
const database = require('./database')

var url = 'https://www.tianqiapi.com/api?version=epidemic&appid=14249972&appsecret=H2UiGOGq'
var tianxing = 'http://api.tianapi.com/txapi/ncov/index?key=************'   //自行去天行API注册获取key值
var city = 'http://api.tianapi.com/txapi/ncovcity/index?key=************'
function getData() {
    http.get(city, res => {
        let html = ''
        res.on('data', data => {
            html += data
        })
        res.on('end', () => {
            let data = JSON.parse(html).newslist
            let proviceinsertData = ''
            let areainsertData = ''
            let totalCont = {
                confirmedCount: 0,
                curedCount: 0,
                deadCount: 0
            }
            for (let i = 0; i < data.length; i++) {
                let provice = data[i]
                totalCont.confirmedCount += provice.confirmedCount
                totalCont.curedCount += provice.curedCount
                totalCont.deadCount += provice.deadCount
                proviceinsertData += `('${provice.provinceShortName}',${provice.confirmedCount},${provice.curedCount},${provice.deadCount}),`
                let citys = provice.cities
                for (let j = 0; j < citys.length; j++) {
                    let city = citys[j]
                    areainsertData += `('${provice.provinceShortName}','${city.cityName}',${city.confirmedCount},${city.suspectedCount},${city.curedCount},${city.deadCount}),`
                }
            }
            proviceinsertData = proviceinsertData.substr(0, proviceinsertData.length - 1)
            areainsertData = areainsertData.substr(0, areainsertData.length - 1)
            if (data.length != 0) {
                //保存省级数据
                database.query('truncate table province')
                database.query(`insert into province (provinceName,confirmedNum,curesNum,deathsNum) values ${proviceinsertData}`, err => {
                    if (err)
                        console.log(err);
                    else
                        console.log('省级数据保存完成');
                })
                database.query('truncate table history')
                //保存市级数据
                database.query('truncate table area')
                database.query(`insert into area (provinceName,cityName,confirmedCount,suspectedCount,curedCount,deadCount) values ${areainsertData}`, err => {
                    if (err)
                        console.log(err);
                    else
                        console.log('地区数据保存完成');

                })
                //全国总数据
                database.query('truncate table china')
                database.query(`insert into china (diagnosed,suspect,death,cured) values 
                (${totalCont.confirmedCount},${0},${totalCont.deadCount},${totalCont.curedCount})`, err => {
                    if (err)
                        console.log(err);
                    else
                        console.log('全国数据保存完成');
                })
            }
            getTime()

        })
    })
    //获取新闻数据
    http.get(tianxing, res => {
        let html = ''
        res.on('data', data => {
            html += data
        })
        res.on('end', () => {
            let data = JSON.parse(html).newslist
            let news = data[0].news
            
            let now = new Date().getTime()
            for (let index = 0; index < news.length; index++) {
                let data = news[index];
                // newsinsertData += `(${data.id},'${formatTime(parseInt((data.pubDate +'').substr(0,10)))}','${data.pubDateStr}','${data.title}','${data.summary}',
                // '${data.infoSource}','${data.sourceUrl}','${data.provinceName}','${formatTime(parseInt((data.createTime +'').substr(0,10)))}','${formatTime(parseInt((data.modifyTime +'').substr(0,10)))}'),`

                (function (data) {
                    database.query(`select id from news where id = ${data.id}`, (err, result) => {
                        if (!result.length) {
                            database.query(`insert into news values (${data.id},'${formatTime(parseInt((data.pubDate +'').substr(0,10)))}','${data.pubDateStr}','${data.title}','${data.summary}',
                            '${data.infoSource}','${data.sourceUrl}','${data.provinceName}','${formatTime(parseInt((data.createTime +'').substr(0,10)))}','${formatTime(parseInt((data.modifyTime +'').substr(0,10)))}')`, err => {
                                if (err)
                                    console.log(err);
                                else
                                    console.log('新增新闻数据');
                            })
                        } else {
                            let time = (now - parseInt((data.pubDate + '')))
                            database.query(`update news set pubDateStr='${data.pubDateStr}' where id = ${data.id}`, err => {
                                if (err)
                                    console.log(err);
                            })
                        }
                    })
                })(data)
            }
        })
    })
}

function formatTime(number, format = 'Y-M-D h:m:s') {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}

//数据转化  
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function getTime() {
    var now = new Date()
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();

    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    //这样写显示时间在1~9会挤占空间；所以要在1~9的数字前补零;
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    console.log(`---------${year}/${month}/${day} ${hour}:${minute}:${second}---------`);

}
getData()
setInterval(() => {
    getData()
}, 1000 * 60 * 10);

// https.get(url, res => {
    //     let html = ''
    //     res.on('data', data => {
    //         html += data
    //     })
    //     res.on('end', () => {
    //         let data = JSON.parse(html).data
    //         console.log(data);
            
    //         let history = data.history
    //         let area = data.area
    //         let historyinsertData = ''
    //         getTime()
    //         //插入历史数据
    //         for (let index = 0; index < history.length; index++) {
    //             let data = history[index]
    //             historyinsertData += `('${data.date}',${data.confirmedNum},${data.suspectedNum},${data.curesNum},${data.deathsNum},${data.suspectedIncr}),`
    //         }
    //         historyinsertData = historyinsertData.substr(0, historyinsertData.length - 1)
    //         //插入市级地区数据
    //         let areainsertData = ''
    //         for (let i = 0; i < area.length; i++) {
    //             let provice = area[i]
    //             for (let j = 0; j < provice.cities.length; j++) {
    //                 let city = provice.cities[j]
    //                 areainsertData += `('${provice.provinceName}','${city.cityName}',${city.confirmedCount},${city.suspectedCount},${city.curedCount},${city.deadCount}),`
    //             }
    //         }
    //         areainsertData = areainsertData.substr(0, areainsertData.length - 1)
    //         if (history.length != 0) {
    //             database.query('truncate table history')
    //             database.query(`insert into history (date,confirmedNum,suspectedNum,curesNum,deathsNum,suspectedIncr) values ${historyinsertData}`, err => {
    //                 if (err)
    //                     console.log(err);
    //                 else
    //                     console.log('历史数据保存完成');
    //             })
    //         }
    //         if (area.length != 0) {
    //             database.query('truncate table area')
    //             database.query(`insert into area (provinceName,cityName,confirmedCount,suspectedCount,curedCount,deadCount) values ${areainsertData}`, err => {
    //                 if (err)
    //                     console.log(err);
    //                 else
    //                     console.log('地区数据保存完成');

    //             })
    //         }
    //         //插入省级地区数据
    //         let proviceData = data.list
    //         let proviceinsertData = ''
    //         for (let p = 0; p < proviceData.length; p++) {
    //             let str = proviceData[p] + ''
    //             let arr = str.split('，')
    //             let line = {
    //                 provice: arr[0].split(' ')[0],
    //                 confirmedNum: arr[0].split(' ')[2],
    //                 curesNum: 0,
    //                 deathsNum: 0
    //             }
    //             if (arr[1]) {
    //                 if (arr[1].split(' ')[0] == '治愈') {
    //                     line.curesNum = arr[1].split(' ')[1]
    //                 } else if (arr[1].split(' ')[0] == '死亡') {
    //                     line.deathsNum = arr[1].split(' ')[1]
    //                 }
    //             }
    //             if (arr[2]) {
    //                 if (arr[2].split(' ')[0] == '治愈') {
    //                     line.curesNum = arr[2].split(' ')[1]
    //                 } else if (arr[2].split(' ')[0] == '死亡') {
    //                     line.deathsNum = arr[2].split(' ')[1]
    //                 }
    //             }
    //             proviceinsertData += `('${line.provice}',${line.confirmedNum},${line.curesNum},${line.deathsNum}),`
    //         }
    //         proviceinsertData = proviceinsertData.substr(0, proviceinsertData.length - 1)
    //         if (proviceData.length != 0) {
    //             database.query('truncate table province')
    //             database.query(`insert into province (provinceName,confirmedNum,curesNum,deathsNum) values ${proviceinsertData}`, err => {
    //                 if (err)
    //                     console.log(err);
    //                 else
    //                     console.log('省级数据保存完成');
    //             })
    //         }
    //         //全国总数据
    //         database.query('truncate table china')
    //         database.query(`insert into china (diagnosed,suspect,death,cured,date) values 
    //         (${data.diagnosed},${data.suspect},${data.death},${data.cured},'${data.date}')`, err => {
    //             if (err)
    //                 console.log(err);
    //             else
    //                 console.log('全国数据保存完成');
    //         })


    //     })
    // })