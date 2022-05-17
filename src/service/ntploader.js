/*
* ntp通讯服务
* 该文件解决了数据的加载问题
*/
import { NTPClient } from 'ntpclient';
export {syncTime,ntpserver};

const ntpserver = 'time.windows.com';//微软授时中心
//const ntpserver = 'ntp.ntsc.ac.cn';//国家授时中心同步服务器，有时响应慢

//同步时间
//从国家授时中心取标准北京时间。
//默认使用内部服务器
//错误会抛出
async function syncTime(inputServer=ntpserver){
    let result = await new NTPClient(inputServer, 123, 40 * 1000).getNetworkTime();
    //console.log(result);
    return result;

}
