//
//  echart.js
//  echart
//
//  Created by Horton on 1/20/17.
//  Copyright © 2017 YY Inc. All rights reserved.
//

var TypeChart = echarts.init(document.getElementById('echartId_type'));
option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['iOS','Frontend','Backend','Android']
    },
    series: [
        {
            name:'Skill Type',
            type:'pie',
            radius: ['30%', '70%'],
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
                {value:38, name:'iOS'},
                {value:34, name:'Frontend'},
                {value:20, name:'Backend'},
                {value:8, name:'Android'}
            ]
        }
    ]
};
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
                {value:30, name:'Objective-C'},
                {value:22, name:'Frontend'},
                {value:22, name:'PHP'},
                {value:8, name:'Golang'},
                {value:8, name:'Python'},
                {value:10, name:'Others'}
            ]
        }
    ]
};
LanguageChart.setOption(option);