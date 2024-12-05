/* 公历转农历代码思路：
1、建立农历年份查询表
2、计算输入公历日期与公历基准的相差天数
3、从农历基准开始遍历农历查询表，计算自农历基准之后每一年的天数，并用相差天数依次相减，确定农历年份
4、利用剩余相差天数以及农历每个月的天数确定农历月份
5、利用剩余相差天数确定农历哪一天
https://github.com/xm2by/fragment
 */
const LUNAR_HOLIDAY = {
	'0101': '春节',
	'0115': '元宵节',
	'0505': '端午节',
	'0707': '七夕',
	'0715': '中元节',
	'0815': '中秋节',
	'0909': '重阳节',
	'1208': '腊八节',
	'1224': '小年'
};
const PUBLIC_HOLIDAY = {
	'0101': '元旦',
	'0214': '情人节',
	'0307': '女生节',
	'0308': '妇女节',
	'0312': '植树节',
	'0314': '白色情人',
	'0315': '消费者日',
	'0401': '愚人节',
	'0404': '复活节',
	'0501': '劳动节',
	'0504': '青年节',
	'0510': '母亲节',
	'0512': '护士节',
	'0601': '儿童节',
	'0620': '父亲节',
	'0701': '建党节',
	'0801': '建军节',
	'0910': '教师节',
	'0928': '孔子诞辰',
	'1001': '国庆节',
	'1006': '老人节',
	'1024': '联合国日',
	'1101': '万圣节',
	'1125': '感恩节',
	'1224': '平安夜',
	'1225': '圣诞节'
};

const SOLAR_STERM = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];


const SOLAR_STERM_INFO = [0, 1272480000, 2548020000, 3830160000, 5120220000, 6420840000,
	7732020000, 9055260000, 10388940000, 11733060000, 13084320000, 14441580000,
	15800580000, 17159340000, 18513780000, 19861980000, 21201000000, 22529640000,
	23846820000, 25152600000, 26447700000, 27733440000, 29011920000, 30285480000
];
const LUNAR_YEAR_ARR = [
	0x0b557, //1949
	0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
	0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
	0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
	0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
	0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
	0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
	0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
	0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
	0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
	0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
	0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
	0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
	0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
	0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
	0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
	0x0d520 //2100
];
const LUNAR_MONTH = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAY = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'];
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
function sloarToLunar(sy, sm, sd) {
	if (typeof (sy) == 'string') {
		let arr = sy.split('-');
		sy = Number(arr[0]);
		sm = Number(arr[1]);
		sd = Number(arr[2]);
	}
	let publicHoliday = (sm > 9 ? sm : '0' + sm) + '' + (sd > 9 ? sd : '0' + sd);
	if (PUBLIC_HOLIDAY.hasOwnProperty(publicHoliday)) {
		return PUBLIC_HOLIDAY[publicHoliday];
	}
	sm -= 1;
	let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
	let ly, lm, ld;
	for (let j = 0; j < LUNAR_YEAR_ARR.length; j++) {
		daySpan -= lunarYearDays(LUNAR_YEAR_ARR[j]);
		if (daySpan <= 0) {
			ly = 1949 + j;
			daySpan += lunarYearDays(LUNAR_YEAR_ARR[j]);
			break
		}
	}
	for (let k = 0; k < lunarYearMonths(LUNAR_YEAR_ARR[ly - 1949]).length; k++) {
		daySpan -= lunarYearMonths(LUNAR_YEAR_ARR[ly - 1949])[k];
		if (daySpan <= 0) {
			if (hasLeapMonth(LUNAR_YEAR_ARR[ly - 1949]) && hasLeapMonth(LUNAR_YEAR_ARR[ly - 1949]) <= k) {
				if (hasLeapMonth(LUNAR_YEAR_ARR[ly - 1949]) < k) {
					lm = k;
				} else if (hasLeapMonth(LUNAR_YEAR_ARR[ly - 1949]) === k) {
					lm = '闰' + k;
				} else {
					lm = k + 1;
				}
			} else {
				lm = k + 1;
			}
			daySpan += lunarYearMonths(LUNAR_YEAR_ARR[ly - 1949])[k];
			break
		}
	}
	ld = daySpan;
	let paraHoliday = (lm > 9 ? lm : '0' + lm) + '' + (ld > 9 ? ld : '0' + ld);
	if (LUNAR_HOLIDAY.hasOwnProperty(paraHoliday)) {
		return LUNAR_HOLIDAY[paraHoliday];
	}
	/*
	if (lm == 12) {
		var theLastDay = lDate.isLeap ? leapDays(y) : monthDays(y, m); //农历当月最後一天
		if (theLastDay == ld) {
			return "除夕";
		}
	}*/
	let temp = getSolarTerm(sy, sm + 1, sd)
	if (temp) return temp;
	if (hasLeapMonth(LUNAR_YEAR_ARR[ly - 1949]) && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
		lm = `闰${LUNAR_MONTH[/\d/.exec(lm) - 1]}`
	} else {
		lm = LUNAR_MONTH[lm - 1];
	}
	ly = '';
	if (ld < 11) {
		ld = `${LUNAR_DAY[10]}${LUNAR_DAY[ld-1]}`
	} else if (ld > 10 && ld < 20) {
		ld = `${LUNAR_DAY[9]}${LUNAR_DAY[ld-11]}`
	} else if (ld === 20) {
		ld = `${LUNAR_DAY[1]}${LUNAR_DAY[9]}`
	} else if (ld > 20 && ld < 30) {
		ld = `${LUNAR_DAY[11]}${LUNAR_DAY[ld-21]}`
	} else if (ld === 30) {
		ld = `${LUNAR_DAY[2]}${LUNAR_DAY[9]}`
	}
	if (ld == '初一') ld = lm + '月';

	/*
	return {
		lunarYear: ly,
		LUNAR_MONTH: lm,
		LUNAR_DAY: ld,
	}*/
	return ld;
}
function hasLeapMonth(ly) {
	if (ly & 0xf) {
		return ly & 0xf
	} else {
		return false
	}
}
function leapMonthDays(ly) {
	if (hasLeapMonth(ly)) {
		return (ly & 0xf0000) ? 30 : 29
	} else {
		return 0
	}
}
function lunarYearDays(ly) {
	let totalDays = 0;
	for (let i = 0x8000; i > 0x8; i >>= 1) {
		let monthDays = (ly & i) ? 30 : 29;
		totalDays += monthDays;
	}
	if (hasLeapMonth(ly)) {
		totalDays += leapMonthDays(ly);
	}

	return totalDays
}
function lunarYearMonths(ly) {
	let monthArr = [];
	for (let i = 0x8000; i > 0x8; i >>= 1) {
		monthArr.push((ly & i) ? 30 : 29);
	}
	if (hasLeapMonth(ly)) {
		monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
	}

	return monthArr
}
function getTianGan(ly) {
	let tianGanKey = (ly - 3) % 10;
	if (tianGanKey === 0) tianGanKey = 10;
	return TIAN_GAN[tianGanKey - 1]
}
function getDiZhi(ly) {
	let diZhiKey = (ly - 3) % 12;
	if (diZhiKey === 0) diZhiKey = 12;
	return DIZHI[diZhiKey - 1]
}
function getSolarTerm(sy, sm, sd) {
	sm -= 1;
	let solarTermStr = "";
	let tmp1 = new Date((31556925974.7 * (sy - 1900) + SOLAR_STERM_INFO[sm * 2 + 1]) + Date.UTC(1900, 0, 6, 2, 5));
	let tmp2 = tmp1.getUTCDate();
	if (tmp2 == sd) solarTermStr = SOLAR_STERM[sm * 2 + 1];
	tmp1 = new Date((31556925974.7 * (sy - 1900) + SOLAR_STERM_INFO[sm * 2]) + Date.UTC(1900, 0, 6, 2, 5));
	tmp2 = tmp1.getUTCDate();
	if (tmp2 == sd) solarTermStr = SOLAR_STERM[sm * 2];
	if (sd > 1) {
		sd -= 1;
	} else {
		sm -= 1;
		sd = 31;
		if (sm < 0) {
			sy -= 1;
			sm = 11;
		}
	}
	return solarTermStr;
}

module.exports = {
	sloarToLunar
}