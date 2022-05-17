export { getdatestring,addZeroToInput, analy, testJq, numcn, jqcn, mcn, dcn, gancn, zhicn, sxcn }

//月份中英文对应表
const numcn = { 0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九' };
//节气中英文对应表
const jqcn = { lc: '立春', ys: '雨水', jz: '惊蛰', cf: '春分', qm: '清明', gy: '谷雨', lx: '立夏', xm: '小满', mz: '芒种', xz: '夏至', xs: '小暑', ds: '大暑', lq: '立秋', cs: '处暑', bl: '白露', qf: '秋分', hl: '寒露', sj: '霜降', ld: '立冬', xx: '小雪', dx: '大雪', dz: '冬至', xh: '小寒', dh: '大寒' };
//月份中英文对应表
const mcn = { 1: '正', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二', };
//日子中英文对应表
const dcn = { 1: '初一', 2: '初二', 3: '初三', 4: '初四', 5: '初五', 6: '初六', 7: '初七', 8: '初八', 9: '初九', 10: '初十', 11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五', 16: '十六', 17: '十七', 18: '十八', 19: '十九', 20: '二十', 21: '廿一', 22: '廿二', 23: '廿三', 24: '廿四', 25: '廿五', 26: '廿六', 27: '廿七', 28: '廿八', 29: '廿九', 30: '三十' };
//月份中英文对应表
const gancn = { 1: '甲', 2: '乙', 3: '丙', 4: '丁', 5: '戊', 6: '己', 7: '庚', 8: '辛', 9: '壬', 0: '癸' };
//月份中英文对应表
const zhicn = { 1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申', 10: '酉', 11: '戌', 0: '亥', };
//属相中英文对应表
const sxcn = { 1: '鼠', 2: '牛', 3: '虎', 4: '兔', 5: '龙', 6: '蛇', 7: '马', 8: '羊', 9: '猴', 10: '鸡', 11: '狗', 0: '猪', };

/*
*传入数据分解成 年 月 日和时分
* '2002-3-1 12:23' >> ['2002','3','1','12:23']
*/
function getdatestring(input = '') {
    let result = [];
    if (input == '') {
        return result;
    }

    let tdata = input.split(' ')[0].split('-');
    if (input.startsWith('-')) {//判断是否公元前
        result.push('-' + tdata[1]);//年
        result.push(tdata[2]);//月
        result.push(tdata[3]);//日
    } else {
        result.push(tdata[0]);//年
        result.push(tdata[1]);//月
        result.push(tdata[2]);//日
    }

    result.push(input.split(' ')[1]);//时分

    return result;

}

/*
* 判断是节气还是月份
* ['11rd','4x','0x','123rx','7rd','5dr','11m','dz','lc','jm','rx','12x','1x'];
* 输出节气值
*/
function analy(input = '') {

    let result = '';
    if (input.match(/^[1-9]{1,2}r?[x|d]$/)) {//正则：以1,2位数字开头，中间可能出现字母r，以字母x或者d结尾的 ，为合格数据
        if (input.indexOf('r') != -1) {
            result += '闰';
            result += mcn[input.split('r')[0]];
        } else {
            if (Number(input.charAt(1))) {//第二位是数字
                result += mcn[input.substring(0, 2)];
            } else {
                result += mcn[input.substring(0, 1)];
            }

        }
        result += '月';
        if (input.endsWith('x')) {
            result += '小';
        } else if (input.endsWith('d')) {
            result += '大';
        }

    } else if (input.match(/^[a-z]{2}$/)) {//正则，如果是两位字母
        if (jqcn[input]) {//如果落在节气列表中为合格数据
            result = jqcn[input];
        } else {
            result = '节气 错误';
        }

    } else {
        result = 'data error';
    }
    return result;
}

/**
 * 判断节气
 * @param {} input 
 * @returns -1:错误数据，0:错误节气,1:朔日，2：节气
 */
function testJq(input) {
    let result = -1;
    if (input.match(/^[1-9]{1,2}r?[x|d]$/)) {//正则：以1,2位数字开头，中间可能出现字母r，以字母x或者d结尾的 ，为合格数据
        result = 1;
    } else if (input.match(/^[a-z]{2}$/)) {//正则，如果是两位字母
        if (jqcn[input]) {//如果落在节气列表中为合格数据
            result = 2;
        } else {
            result = 0;
        }
    }
    return result;
}

/**
 * 为输入日期数据补0 2000-1-4 >> 2000-01-04
 * @param {} input 
 */
function addZeroToInput(input) {
    let result = input;
    if(input.match(/^[-]{1}\d{1,4}[-]{1}\d{1,2}[-]{1}\d{1,2}$/)){//判断是公元前
        let td = input.split('-');
        result = td[1]+'-';
        result += (parseInt(td[2])<10?'0'+parseInt(td[2]):td[2])+'-';
        result += (parseInt(td[3])<10?'0'+parseInt(td[3]):td[3]);
    }else if(input.match(/\d{1,4}[-]{1}\d{1,2}[-]{1}\d{1,2}$/)){//判断是公元后
        let td = input.split('-');
        result = td[0]+'-';
        result += (parseInt(td[1])<10?'0'+parseInt(td[1]):td[1])+'-';
        result += (parseInt(td[2])<10?'0'+parseInt(td[2]):td[2]);
    }
    return result;
}

