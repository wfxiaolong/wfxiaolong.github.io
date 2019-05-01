//
//  echart.js
//  echart
//
//  Created by Horton on 1/20/17.
//  Copyright © 2017 YY Inc. All rights reserved.
//

var TypeChart = echarts.init(document.getElementById('echartId_type'));
option = {
    color: ['#606b77'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '0%',
        right: '8%',
        bottom: '18%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['Frontend', 'iOS', 'Backend', 'Backtage', 'Hybrid', 'Android', 'Ohters'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'value',
            type:'bar',
            barWidth: '46%',
            data:[100, 95, 80, 80, 95, 30, 30]
        }
    ]
};

// option = {
//     tooltip: {
//         trigger: 'item',
//         formatter: "{a} <br/>{b}: {c} ({d}%)"
//     },
//     legend: {
//         orient: 'vertical',
//         x: 'left',
//         data:['iOS','Frontend','Backend','Android']
//     },
//     series: [
//         {
//             name:'Skill Type',
//             type:'pie',
//             radius: ['30%', '70%'],
//             avoidLabelOverlap: false,
//             label: {
//                 normal: {
//                     show: false,
//                     position: 'center'
//                 },
//                 emphasis: {
//                     show: true,
//                     textStyle: {
//                         fontSize: '15',
//                         fontWeight: 'bold'
//                     }
//                 }
//             },
//             labelLine: {
//                 normal: {
//                     show: false
//                 }
//             },
//             data:[
//                 {value:38, name:'iOS'},
//                 {value:34, name:'Frontend'},
//                 {value:20, name:'Backend'},
//                 {value:8, name:'Android'}
//             ]
//         }
//     ]
// };
TypeChart.setOption(option);


var LanguageChart = echarts.init(document.getElementById('echartId_language'));
option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['Objective-C','PHP','Python','Golang','Frontend','Others']
    },
    series: [
        {
            name:'Skill Language',
            type:'pie',
            radius: ['25%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '15',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:30, name:'Frontend'},
                {value:22, name:'Objective-C'},
                {value:22, name:'PHP'},
                {value:8, name:'Golang'},
                {value:8, name:'Python'},
                {value:10, name:'Others'}
            ]
        }
    ]
};
LanguageChart.setOption(option);