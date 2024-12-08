/**
 * 通用配置文件
 */

// 职业选项
const professionOptions = {
    'dev': '开发',
    'product': '产品',
    'design': '设计',
    'operation': '运营',
    'hardware': '硬件',
    'sales': '销售',
    'consulting': '咨询',
    'maintenance': '维护',
    'research': '研究',
    'media': '媒体',
    'investment': '投资',
    'legal': '法务',
    'teacher': '教师',
    'student': '学生',
    'art': '艺术',
    'other': '其他'
};

// 生成反向映射
const professionMapReverse = {};
for (let key in professionOptions) {
    professionMapReverse[professionOptions[key]] = key;
}

// 生成选项列表
const professionOptionsList = [];
for (let key in professionOptions) {
    professionOptionsList.push({
        key: key,
        value: professionOptions[key]
    });
}

// 就业状态选项
const statusOptions = {
    'employed': '在职',
    'startup': '创业',
    'freelance': '自由',
    'seeking': '求职',
    'student': '在校'
};

module.exports = {
    professionOptions: professionOptions,
    professionMap: professionMapReverse,
    professionMapReverse: professionOptions,
    professionOptionsList: professionOptionsList,
    statusOptions: statusOptions
};
