/**
 * @todo 搞定docker
 * @todo 搞定测试用例（确定框架，还需要完成测试用例）
 * @todo 搞定打包工具 不急
 * 
 * 增加节气信息。2022-5-14 ok
 * 优化代码 日期判断处简化下来，跟节气部分一样明确。2022-5-14 ok
 * 搞定异步调用 2022-5-15 ok
 * 搞定测试用例（使用mocha）,确定框架 2022-5-15 ok
 * 数据更新，考虑把紫金天文台的权威数据搞下来。数据考虑上下三千年 2022-5-16 ok 公元前暂时搞定，还不确定是不是有点小问题。因为公元前年份
 * 
 * 返回数据结构
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
import {createServer} from 'restify';
import { getLunar} from '../service/lunarService.js'
import { addZeroToInput} from '../util/util.js'
import { loadData } from '../service/dataloader.js';

function processLunar(req, res, next) {

    let reqdate = '';
    if(!req.params.indate){//如果无参就传递今天
        let todaynow = new Date();
        reqdate += todaynow.getFullYear()+'-'+(todaynow.getMonth()+1)+'-'+todaynow.getDate();
        
    }else{
        reqdate=req.params.indate;
    }

    reqdate = addZeroToInput(reqdate);

    res.send((getLunar(reqdate)));

}

var server = createServer();
server.get('/lunar/:indate', processLunar);
server.head('/lunar/:indate', processLunar);

server.listen(8080, function() {
    //加载数据
    loadData().then(()=>console.log('%s listening at %s', server.name, server.url));
});