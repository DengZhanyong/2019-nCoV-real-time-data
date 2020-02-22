# 2019-nCoV-real-time-data

天天在家还是要找点事情做，我相信很多程序员都想要疫情数据，我也不例外，开始我还想着去爬去其他网站的数据。尝试了一下很麻烦还费时，于是我找到了一个api接口，该接口包含了今日数据、历史数据、各省/市数据，但是他们全部都是在一个JSON数据中，使用起来很不方便。

为了大家更好的调用，我对这个数据进行处理后保存到了自己的数据库中，并开放出了自己的接口，更加的方便灵活，具体如下：

注：所有接口全部为GET请求

获取全国总数据
http://www.dzyong.top:3005/yiqing/total

返回结果：

{
    "data": [
        {
            "id": 1,
            "diagnosed": 24401,   //确诊
            "suspect": 23260,   //疑似
            "death": 492,   //死亡
            "cured": 967,   //治愈
            "date": "2020-02-05 15:36:16"   //更新时间
        }
    ]
}



获取历史数据（由于原接口不对个人开放，这里暂时无法更新最新数据）
http://www.dzyong.top:3005/yiqing/history

返回结果：



{
    "data": [
        {
            "id": 1,
            "date": "2020-02-04",
            "confirmedNum": 24363,
            "suspectedNum": 23260,
            "curesNum": 892,
            "deathsNum": 491,
            "suspectedIncr": 3971
        },
        {
            "id": 2,
            "date": "2020-02-03",
            "confirmedNum": 20471,
            "suspectedNum": 23214,
            "curesNum": 630,
            "deathsNum": 425,
            "suspectedIncr": 5072
        },
       ......
    ]
}





获取各省/市最新总数据
http://www.dzyong.top:3005/yiqing/province

请求参数：

参数名 是否必填 说明

province 否 当为空或不填时，返回所有省/市最新总数据，当传参时要注意，不要带‘省’或‘市’字，如：‘重庆市’应填‘重庆’

返回结果：



{
    "data": [
        {
            "id": 1,
            "provinceName": "湖北",
            "confirmedNum": 16678,
            "curesNum": 533,
            "deathsNum": 479
        },
        {
            "id": 2,
            "provinceName": "浙江",
            "confirmedNum": 895,
            "curesNum": 75,
            "deathsNum": 0
        },
        {
            "id": 3,
            "provinceName": "广东",
            "confirmedNum": 895,
            "curesNum": 43,
            "deathsNum": 0
        }
        ......
    ]
}





获取各省/市/地区数据
http://www.dzyong.top:3005/yiqing/area

请求参数：

参数名 是否必填 说明

area 否 当为空或不填时，返回所有省市地区数据，当传参时要注意，不要带‘省’或‘市’字，如：‘重庆市’应填‘重庆’

返回结果（以湖北为例）：



{
    "data": [
        {
            "id": 1,
            "provinceName": "湖北",
            "cityName": "武汉",
            "confirmedCount": 8351,
            "suspectedCount": 0,
            "curedCount": 373,
            "deadCount": 362
        },
        {
            "id": 2,
            "provinceName": "湖北",
            "cityName": "黄冈",
            "confirmedCount": 1645,
            "suspectedCount": 0,
            "curedCount": 52,
            "deadCount": 25
        },
        {
            "id": 3,
            "provinceName": "湖北",
            "cityName": "孝感",
            "confirmedCount": 1462,
            "suspectedCount": 0,
            "curedCount": 7,
            "deadCount": 18
        },
        .......
    ]
}




获取最新动态新闻（最早到2月6日数据）
http://www.dzyong.top:3005/yiqing/news

请求参数：

参数名 是否 必填说明

pageNum 否 页码未填时，默认查询所有新闻）

pageSize 否 每页新闻条数（未填时，默认查询所有新闻）

注：返回结果中的 pubDateStr 字段仅为参考时间，若想实时更新，可通过 pubDate 字段自行计算



{
    "data": [
        {
            "id": 2398,
            "pubDate": "2020-02-06 18:29:58",
            "pubDateStr": "9分钟前",
            "title": "深圳青年接力护送 10万只爱心口罩由泰国抵深",
            "summary": "2月4日，由深航青年突击队承运的100箱共计10万只口罩抵达深圳。深圳海关特事特办，30分钟火速清关。\n",
            "infoSource": "人民网",
            "sourceUrl": "http://m.weibo.cn/2286908003/4469037352052652",
            "provinceName": "广东省",
            "createTime": "2020-02-06 18:34:17",
            "modifyTime": "2020-02-06 18:34:17"
        },
        {
            "id": 2390,
            "pubDate": "2020-02-06 17:42:14",
            "pubDateStr": "57分钟前",
            "title": "辽宁新增2例累计91例",
            "summary": "2月5日22时至2月6日14时，辽宁省鞍山市新增2例本地感染新型冠状病毒感染的肺炎确诊病例,其中1例为重型病例，1例为普通型病例。截至2020年2月6日14时，辽宁省累计报告新型冠状病毒感染的肺炎确诊病例91例，治愈出院4例。",
            "infoSource": "人民网",
            "sourceUrl": "http://m.weibo.cn/2286908003/4469025340136096",
            "provinceName": "辽宁省",
            "createTime": "2020-02-06 17:48:14",
            "modifyTime": "2020-02-06 17:48:14"
        },
		......
}
