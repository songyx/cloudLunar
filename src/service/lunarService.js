/**
 * 
 * version   : v0.5
 * author    : 云图追梦 （b站id）
 * date      : 2022.5.15
 * disc      : 查表计算农历的服务方法文件，表数据缓存在内存中。表数据根据vsop 87或者vsop 2013或者紫金山天文台发布的权威数据来定。
 * status    : 首次发布
 * 
 */
export { getLunarDate ,getLunar,getlunarjq};

import { clenderDatas } from '../service/dataloader.js';
import { numcn,jqcn, mcn, dcn, gancn, zhicn, sxcn } from '../util/util.js'

/**
 * 得到农历 日期及节气
 * 
 * 
 * @param {*} input 
 */
 function getLunar(input = '2010-01-28') {

     let start = Date.now();

     let result =  getLunarDate(input);
     result = getlunarjq(input,result);
     result.cnstr = result.datecnstr+' '+result.jqcnstr;//补全字符串

     console.log('input:%s >> lunar:%s used:%dms',input,result.cnstr,Date.now()-start);
     return result;
     
 }

/**
 * 得到农历日期 简化版本
 * 
 * {"m1":{"name":"4x","date":"01","time":"04:27"},"j1":{"name":"lx","date":"05","time":"20:25"},"j2":{"name":"xm","date":"21","time":"09:22"},"m2":{"name":"5d","date":"30","time":"19:30"}}
 * 
 * @param {*} input 
 */
 function getLunarDate(input = '2010-01-28',result={ year: -1, month: -1, date: -1, status: '200', msg: 'ok' }) {

    // console.log(input);
    result.input = ''+input;

    if (input.match(/^-?\d{1,4}-\d{1,2}-\d{1,2}$/)) {//校验数据
        //console.log('data ok.');
        let y,m,d;
        if(input.substring(0,1)=='-'){
            [,y, m, d] = input.split('-');
            y='-'+y;
        }else{
            [y, m, d] = input.split('-');
        }
        let mobj = clenderDatas[y][m];
        console.log(JSON.stringify(mobj));

        if (mobj) {//如果数据命中

            //将上个月和这个月的所有节气都取出来
            //先取上个月的,上个月的涉及到跨年问题
            let tm ;//临时月份对象
            let ts = (m=='01')?12:parseInt(m)<11?'0'+(parseInt(m)-1):''+(parseInt(m)-1);//是一月份时向前取就是去年12月，否则就是上个月。
            let ty =(m=='01')?''+(parseInt(y)-1):y;//是一月份时向前取就是跨年，否则就是今年。
            tm=clenderDatas[ty][ts];

            //取上个月的最后一个朔日对象
            let upsz = tm['m2']?tm['m2']:tm['m1'];//命中m2就给m2，否则给m1对象

            if(mobj['m2']&&parseInt(d)>=parseInt(mobj['m2']['date'])){//传入日期在m2之后或者m2当天
                result = crtDateResult(input,result,y,m,mobj['m2']);
            }else if(mobj['m1']&&parseInt(d)>=parseInt(mobj['m1']['date'])){//传入日期在m1之后或者m1当天
                result = crtDateResult(input,result,y,m,mobj['m1']);
            }else{//传入日期在m1之前，用上个月最后朔日对象
                result = crtDateResult(input,result,ty,ts,upsz);
            }

            //直接结束函数
            return addCnString(result);

        } else {
            console.log('no data.');
            result.status = '404';
            result.msg = 'no data.';
            return result;
        }

    } else {
        console.log('data error.');
        result.status = '500';
        result.msg = 'input data error.';
        return result;
    }

}


/**
 * 将传入的数据增加cn值
 * 
 * 增加干支
 * @param {*} input1  {"year":2018,"month":12,"date":2,}
 * @returns {"year":2018,"month":12,"date":2,cnyear:2018,sx:蛇,gz:癸巳,cnmonth:十二,cndate:初二,cn:'2018（癸巳）蛇年十二月初二'}
 * 
 */
function addCnString(input) {

    // input.cnyear=input.year;
    input.cnyear = transNum(input.year);

    input.cnmonth = mcn[input.month];
    input.cndate = dcn[input.date];

    //计算干支
    let ty = parseInt(input.year) - 3;
    let tgz = gancn[Math.abs(ty) % 10] + zhicn[Math.abs(ty) % 12];
    input.gz = tgz;

    //计算属相
    let tsx = sxcn[Math.abs(ty) % 12];
    input.sx = tsx;

    //计算闰大小
    if (input.dx == 'x') {
        input.cndx = '小';
    } else if (input.dx == 'd') {
        input.cndx = '大';
    }

    //生产农历字符串
    let tcn = input.cnyear + '(' + input.gz + ')' + input.sx + '年 ';
    if (input.run) {
        tcn += '闰';
    }
    tcn += input.cnmonth + '月(' + input.cndx + ') ' + input.cndate;

    input.datecnstr = tcn;

    return input;
}

/**
 * 产生节气结果对象
 * @param {输入日期} input 
 * @param {结果对象} result 
 * @param {节气年份} year 
 * @param {节气月份} month 
 * @param {朔日对象} szobj 
 */
 function crtDateResult(input,result,year,month,szobj) {

    let tname = szobj.name;

    result.month = tname.match(/^\d{1,2}/)[0];//农历月份
    result.year = parseInt(result.month)>parseInt(month) ?''+(parseInt(year)-1):year;//农历年份?需要根据月份判断年份

    //日期是上个朔日距离现在的天数。
    let ts = year + '-' + month + '-' + szobj.date;
    let td;
    if(input.substring(0,1)=='-'){//公元前处理
        if(input.indexOf(year)==-1){//公元前js支持的不好，只能用公元后年份模拟，所以年份翻转-2020>>-2018
            ts = (parseInt(year)+2) + '-' + month + '-' + szobj.date;
        }
        td = Math.abs(Math.floor((Date.parse(input.substring(1)) - Date.parse(ts.substring(1))) / (24 * 60 * 60 * 1000))) + 1;//计算出天数
    }else{//公元后正常处理
        td = Math.floor((Date.parse(input) - Date.parse(ts)) / (24 * 60 * 60 * 1000)) + 1;//计算出天数
    }

    result.date = td;//农历日子

    result.dx = tname.match(/[x,d]{1}$/)[0];//设置大小月

    //设置是否闰月
    let trun = false;
    if (tname.match(/[r]{1}/)) {trun = true};
    result.run = trun;

    //直接结束函数
    return result;
 }

/**
 * 将阿拉伯数字转成中文数字
 * @param {*} input 
 */
function transNum(input) {
    let result = '';
    if (input < 0) {
        result += '公元前';
    }

    let tinput = (Math.abs(input) + '').split('');
    for (let i = 0; i < tinput.length; i++) {
        result += numcn[tinput[i]];
    }

    return result;
}

/**
 * 取得节气的方法
 */
 function getlunarjq(input= '2019-01-04',result={ input: input, status: '200', msg: 'ok' }) {
    // console.log(input);
    input = '' + input;

    if (input.match(/^-?\d{1,4}-\d{1,2}-\d{1,2}$/)) {//校验数据
        //console.log('data ok.');
        let y,m,d;
        if(input.substring(0,1)=='-'){
            [,y, m, d] = input.split('-');
            y='-'+y;
        }else{
            [y, m, d] = input.split('-');
        }

        let dint = parseInt(d);

        let mobj = clenderDatas[y][m];//月份对象包含当月所有节气和朔日
        //console.log(JSON.stringify(mobj));

        if (mobj) {//如果数据命中
            //console.log('yes');
            //将上个月和这个月的所有节气都取出来
            //先取上个月的,上个月的涉及到跨年问题

            let tm ;//临时月份对象
            let ts = (m=='01')?12:(m.match(/^[0]{1}\d{1}$/)?'0'+(parseInt(m)-1):''+(parseInt(m)-1));//一月份时向前取就是跨年，否则就是上个月。
            let ty =(m=='01')?''+(parseInt(y)-1):y;//一月份时向前取就是跨年，否则就是上个月。
            tm=clenderDatas[ty][ts];//一月份时向前取就是跨年，否则就是上个月。

            //取上个月的最后一个节气对象
            let upjq;//上个月节气对象
            if(tm['j3']){//从j3一直取到j1；
                upjq = tm['j3'];
            }else if(tm['j2']){
                upjq = tm['j2'];
            }else {
                upjq = tm['j1'];
            }

            if(mobj['j3']&&parseInt(d)>=parseInt(mobj['j3']['date'])){//传入日期在J3之后或者j3当天
                //console.log('j3');
                result = crtJqResult(input,result,y,m,mobj['j3']);
            }else if(mobj['j2']&&parseInt(d)>=parseInt(mobj['j2']['date'])){//传入日期在J2之后或者j2当天
                //console.log('j2');
                result = crtJqResult(input,result,y,m,mobj['j2']);
            }else if(mobj['j1']&&parseInt(d)>=parseInt(mobj['j1']['date'])){//传入日期在J1之后或者j1当天
                //console.log('j1');
                result = crtJqResult(input,result,y,m,mobj['j1']);
            }else{//传入日期在J1之前，也就是上个月最后一个节气之后，用上个月节气
                // console.log('upjq');
                result = crtJqResult(input,result,ty,ts,upjq);
            }

            return result;
          
        } else {
            console.log('no data.');
            result.status = '404';
            result.msg = 'no data.';
            return result;
            
        }

    } else {
        console.log('data error.');
        result.status = '500';
        result.msg = 'input data error.';
        return result;
    }

    console.log(JSON.stringify(result));
}

/**
 * 产生节气结果对象
 * @param {输入日期} input 
 * @param {结果对象} result 
 * @param {节气年份} year 
 * @param {节气月份} month 
 * @param {节气对象} jqobj 
 */
function crtJqResult(input,result,year,month,jqobj) {
    //设置名称
    result.jq=jqobj.name;
    //设置节气日期
    result.jqdate=year+'-'+month+'-'+jqobj.date;
    //设置传入日期在节气的第几天
    result.jqdays=Math.floor((Date.parse(input) - Date.parse(result.jqdate)) / (24 * 60 * 60 * 1000)) + 1;//计算出天数
    //设置节气中文名
    result.cnjq=jqcn[jqobj.name];
    //设置节气字符串
    result.jqcnstr=jqcn[jqobj.name]+' 第'+result.jqdays+'天';

    return result;

}