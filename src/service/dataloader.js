/*
 *  数据加载器服务
 *  v1.1更新20220511
 *  更新：月份内日子变成固定的对象也就是朔日对象和节气对象，而不是日期数作为索引。
 *  该文件解决了数据的加载问题
 *  这个版本改变了数据结构,用年份来做索引头
 *  
 * 
 * 原始数据：dz:-3000-01-13 15:40|11x:-3000-01-13 09:17|dx:-3001-12-29 16:22|
 * 
 * 缓存结构：
    {
        '-3001':{//年份
            '12':{//月份
                'm1':{//朔日 备注：一个月最多两个m，也就最多还有个m2.不会出现m3
                    'name':'11x',//朔日名称
                    'date':'13',//时分对应内容
                    'time':'09:17',//对应时间
                },
                'j1':{//节气 备注：一个月最多三个j，也就最多到j3.不会出现j4
                    'name':'dz',//节气名称
                    'date':'13',//时分对应内容
                    'time':'15:40',//对应时间
                },
            },
        }，
    } 
 */
export { loadDataCb,loadData,calenderframe as clenderDatas, };

import fs from 'fs';
import { getdatestring,testJq } from '../util/util.js'

//日历数据框架
const calenderframe = {};

//let datafile = './data/6klunar3000ud.txt';
let datafile = './data/3klunar.txt';

/**
 * 加载数据
 * @returns 
 */
async function loadData(inputFilename=datafile){
    return new Promise((resolve,reject)=>{
        try{
            loadDataCb(resolve,inputFilename);
        }catch(e){
            reject(e);
        }
    });
}

/**
 * 加载数据的回调方法。
 * @param {} inputFilename 
 * @param {*} callback 
 */
function loadDataCb(callback,inputFilename = datafile) {
    let counter = 0;
    let scounter = 0;
    let single = '';

    let startStamp = Date.now();//启动时记录
    let endStamp;//设置结束时间

    //读取文件并设置回调函数；
    fs.createReadStream(inputFilename, { encoding: 'utf-8' })
        .on('data', (chunk) => {
            //console.log('tims %d length:%dk', counter, chunk.length / 1024);
            let ts = chunk.toString('utf-8');

            //分割数据
            let temp = ts.split('|');
            for (var i = 0; i < temp.length; i++) {

                if (i == 0) {
                    single += temp[i];
                } else if (i == temp.length - 1) {//如果是最后一位留给下次循环处理
                    single = temp[i];
                    continue;//结尾数据不处理
                } else {
                    single = temp[i];
                }

                //判断空数据
                if (single.length < 1) {
                    continue;
                }

                //console.log(single);
                //产生真实数据
                let [nian, yue, ri, shi] = getdatestring(single.substring(single.indexOf(':') + 1));
                let rz = single.substring(0, single.indexOf(':'));

                //创建缓冲数据
                //1.补全年月索引对象
                if (!calenderframe[nian]) {//如果年份对象不存在
                    calenderframe[nian] = { [yue]: {} };//直接创建年对象，以及月份空对象
                } else if (!calenderframe[nian][yue]) {//年份存在，月份对象不存在
                    calenderframe[nian][yue] = {};//直接创建月份对应空对象
                } 
                //2.创建月份内部数据
                crtMonData(nian, yue, ri, shi,rz);

                scounter++;
            }
            //console.log('chunks:%d', counter);
            counter++;
        })
        .on('end', (chunk) => {
            endStamp = Date.now();
            let rststr = 'finish loaded ,loaded date items:'+scounter+' ,time used :'+(endStamp-startStamp)+'ms';
            console.log(rststr);
            callback(rststr);
            //console.log(JSON.stringify(calenderframe['-3000-01-13 09:17']));
            //console.log(JSON.stringify(calenderframe));
        });
}

/**
 * 产生月份内的 朔日，节气对象
 * @param {年} n 
 * @param {月} y 
 * @param {日} r 
 * @param {时} s 
 * @param {对象类型} z 
 */
function crtMonData(n,y,r,s,z){

    let td = {name:z,date:r,time:s};//创建对象
    let tint = testJq(z);//首先判断类型
    
    if(tint==1){//是朔日，朔日只到m2，如果m2存在就不做任何处理。
        if(!calenderframe[n][y]['m1']){//m1不存在？
            calenderframe[n][y]['m1']=td;//产生m1对象
        }else if(!calenderframe[n][y]['m2']){//m1存在，m2不存在？
            calenderframe[n][y]['m2']=td;//产生m2对象
        }
    }else if(tint==2){//是节气，节气只到j3，如果j3存在就不做任何处理。
        if(!calenderframe[n][y]['j1']){//j1不存在？
            calenderframe[n][y]['j1']=td;//产生j1对象
        }else if(!calenderframe[n][y]['j2']){//j1存在，j2不存在？
            calenderframe[n][y]['j2']=td;//产生j2对象
        }else if(!calenderframe[n][y]['j3']){//j1,j2都存在，j3不存在？
            calenderframe[n][y]['j3']=td;//产生j3对象
        }
    }//错误数据不做处理

}