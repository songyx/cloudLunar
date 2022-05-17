# cloudLunar -- 一个基于数据而不是基于算法的农历 a lunar calendar based on data instead of caculate.

##cloudLunar 简介:


符合国标 gb33661 ;
超长日历! 公元前3000-公元后3000年;
使用vsop87d行星算法数据来计算节气;
返回农历，干支，节气信息。

a lunar service on nodejs. 
Compliance gb33661，
from b.c3000-a.d 3000 calendar,
using vsop87d planet data.

##运行方法：

``` bash
npm install restify
node ./src/api/lunarApi.js
```

访问：
<p>http://127.0.0.1:8080/lunar/2022-05-17</p>
```
{"year":"2022","month":"4","date":17,"status":"200","msg":"ok","input":"2022-05-17","dx":"x","run":false,"cnyear":"二零二二","cnmonth":"四","cndate":"十七","gz":"壬寅","sx":"虎","cndx":"小","datecnstr":"二零二二(壬寅)虎年 四月(小) 十七","jq":"lx","jqdate":"2022-05-05","jqdays":13,"cnjq":"立夏","jqcnstr":"立夏 第13天","cnstr":"二零二二(壬寅)虎年 四月(小) 十七 立夏 第13天"}

```


## 报文数据结构
```

 * {
 * //---报文头部数据
 * "input":"2078-03-01",
 * "status":"200",                                     //200 ok,404没有对应数据，500数据错误；
 * "msg":"ok",
 * //---日期报文
 * "year":"2078",                                      //农历年份
 * "month":"1",                                        //农历月份
 * "date":18,                                          //农历日期
 * "dx":"d",                                           //月份大小 x:小 d:大
 * "run":false,                                        //是否闰月 true/false
 * "cnyear":"二零七八",
 * "cnmonth":"正",
 * "cndate":"十八",
 * "cndx":"大",
 * "gz":"戊戌",                                        //年份的干支
 * "sx":"狗",                                          //年份属相
 * "datecnstr":"二零七八(戊戌)狗年 正月(大) 十八",       //日期中文描述
 * //---节气报文
 * "jq":"ys",                                          //节气id 英文（节气拼音首字母，实例为 雨水。注：24节气拼音首字母组合不重复。）
 * "jqdate":"2078-02-18",                              //节气对应的公历日期
 * "jqdays":12,                                        //输入日期距离节气的天数，注意：输入永远在节气之后或者节气当天。
 * "cnjq":"雨水",
 * "jqcnstr":"雨水 第12天",                             //节气中文描述
 * "cnstr":"二零七八(戊戌)狗年 正月(大) 十八 雨水 第12天" //日期+节气的中文描述
 * }
 * 
 */
```
