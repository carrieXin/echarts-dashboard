/**
 * ******************************************************************************************************
 * @description: 数据大屏
 * @example: 概览页点击按钮跳转至参数选择页，启动后跳转至本页
 * @author: carrie
 * ******************************************************************************************************
 */
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';
// echarts
import { EChartOption } from 'echarts';
import 'echarts/map/js/china.js';
import echarts from "echarts";
import chinaJson from 'echarts/map/json/china.json';
import chinaCityJson from 'echarts/map/json/china-cities.json';
import dashboardJson from '../../JSON/dashboard.json';

// animations
import { rotateIn, bounceIn } from '../../animations/animate';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, DecimalPipe],
  animations: [rotateIn, bounceIn]
})
export class DashboardComponent implements OnInit, OnDestroy {

  // 定时器
  private refreshInterval: any;

  // 处理过后的订单列表
  public orderList = [];

  // 滚动的定时器
  private orderTimer: any;

  private orderTimerFlag = false;

  // 参数配置页选择的参数
  private search_view = {
    tags: [],
    refresh: 1,
    orderNum: 10,
    filters: {
      dimension: "team",
      tag_ids: [],
      evaluation_total_from: "month",
      traffic_from: "month",
      evaluation_from: "month",
      loss_from: "month",
      conversion_from: "last_month",
      active_offset: 15,
      goal_from: "month"
    },
    date: {
      evaluation_total_from: null,
      traffic_from: null,
      evaluation_from: null,
      loss_from: null,
      conversion_from: null,
      goal_from: null
    }
  };

  // 提交给后台的参数
  private params = this.search_view['filters'];

  // 刷新频率，单位是分钟
  private refreshTimes = this.search_view['refresh'];

  // 实时订单显示的条数
  public orderNum = this.search_view['orderNum'] || 5;

  public datas = {
    loading: false,
    err: '',
    // 中国地图中散点的最大数值
    maxValue: 0,
    // loading的次数，第一次才需要loading动画
    loadingCount: 0,
    teamShowNum: 8,
    // 实时成交展示的条数
    orderShowNum: 5,
    // 销售目标列表展示的条数
    goalShowNum: 3,
    targetBoxHeight: '37%',
    convertBoxHeight: '36%',
    lossBoxHeight: 'calc(27% - 44px)'
  };

  // 后台返回的数据集合
  public list: any;

  // 各个图表的实例对象
  public instance = {
    flowChart: null,
    chinaMap: null,
    reserveChart: null,
    lossChart: null,
  };

  // 客流情况图表配置项
  public flowChartOption: EChartOption = {
    // animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        const data = params[0];
        const type = this.params['traffic_from'];
        let res;
        switch (type) {
          case 'today':
            res = `时间：${data.axisValue}时<br/>客流量：${data.value}人`;
            break;
          case 'month':
            res = `日期：${data.axisValue}日<br/>客流量：${data.value}人`;
            break;
          case 'year':
            res = `日期：${data.axisValue} <br/>客流量：${data.value}人`;
            break;
          default:
            res = `时间：${data.axisValue}时<br/>客流量：${data.value}人`;
        }
        return res;
      }
    },
    grid: {
      top: 10,
      left: 50,
      right: 40,
      bottom: 25
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // 坐标轴轴线相关设置
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      data: [0]
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: (value, index) => {
          let result;
          if (this.params.traffic_from === 'today' || this.params.traffic_from === null) {
            result = value;
          } else {
            result = `${value / 1000}k`;
          }
          return result;
        }
      },
      // 隐藏grid区域中的分割线
      splitLine: {
        show: false
      },
    },
    series: [
      {
        type: 'line',
        data: [0],
        symbol: 'circle',
        lineStyle: {
          color: '#4FACFB'
        },
        itemStyle: {
          color: '#4FACFB'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#383f8b' // 0% 处的颜色
            }, {
              offset: 1, color: '#0d1039' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }

    ]
  };

  // 中国地图散点图配置项
  public chinaMapOption: EChartOption = {
    backgroundColor: '#080B34',
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.name}: ${this.decimalPipe.transform(params.value[2])} 元`;
      }
    },
    geo: {
      map: 'china',
      // 开启鼠标缩放和漫游
      roam: true,
      // center: [104.29785146779332, 35.854492420955694],
      // 缩放极限控制
      scaleLimit: {
        min: 1,
        max: 100
      },
      // 当前视角的缩放比例
      zoom: 1.2,
      label: {
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        // 地图背景色
        normal: {
          areaColor: '#559aeb',
          borderColor: '#111'
        },
        // hover时的背景色
        emphasis:
        {
          areaColor: '#559aeb'
        }
      }
    },
    series: [
      {
        name: '销售建档',
        type: 'scatter', // 添加散点系列
        coordinateSystem: 'geo', // 坐标系为地理坐标系
        symbolSize: function (val) {
          return val[3]; // 散点圆圈的大小
          // return 10;
        },
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            color: '#FEC696',
            // opacity: 1 // 散点透明度
          }
        }
      }
    ]
  };

  // 蓄客分析图表配置项
  public reserveChartOption: EChartOption = {
    tooltip: {
      trigger: 'axis',
      // 坐标轴指示器，坐标轴触发有效
      axisPointer: {
        // 默认为直线，可选为：'line' | 'shadow' | 'none'
        type: 'shadow'
      }
    },
    // 图例
    legend: {
      show: false
    },
    grid: {
      left: 45, // grid组件容器左侧的距离
      right: 50,
      bottom: 60
    },
    // x轴
    xAxis: {
      // 类目轴
      type: 'category',
      // x轴显示的刻度值
      data: [],
      axisLine: {
        lineStyle: {
          color: '#525471',
          type: 'dashed',
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 12,
        color: '#525471',
        // 处理文本显示内容
        formatter: (value) => {
          return value.slice(5);
        }
      }
    },
    // y轴
    yAxis: [
      // 左侧坐标
      {
        type: 'value',
        // scale: true,
        name: '活跃客户',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 14,
          color: '#525471',
          padding: [10, 0, 0, 0],
        },
        // 坐标轴轴线设置
        axisLine: {
          show: false
        },
        // 坐标轴刻度设置
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#525471',
        },
        // 背景网格线
        splitLine: {
          lineStyle: {
            color: '#525471',
            type: 'dashed'
          }
        },
      },
      // 右侧坐标
      {
        type: 'value',
        // 坐标轴名称
        name: '预算金额',
        splitNumber: 6,
        // 坐标轴名称样式
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 14,
          color: '#525471',
          padding: [10, 0, 0, 45]
        },
        // 右侧坐标轴轴线设置不显示
        axisLine: {
          show: false
        },
        // 隐藏grid区域中的分割线
        splitLine: {
          show: false
        },
        // 坐标轴刻度文字设置
        axisLabel: {
          color: '#525471',
          fontSize: 14,
          align: 'right',
          // 刻度文字与轴线之间的距离
          margin: 50,
          formatter: (value) => {
            return (value / 10000).toFixed(0) + 'w';
          }
        },
        // 坐标轴刻度设置
        axisTick: {
          lineStyle: {
            color: '#525471'
          }
        }
      }
    ],
    series: [
      // 柱图配置项
      {
        name: '潜在客户',
        type: 'bar',
        stack: 'lead',
        // 柱条颜色
        itemStyle: {
          color: '#9BD4FF'
        },
        data: [0],
      },
      {
        name: '兴趣客户',
        type: 'bar',
        stack: 'lead',
        // 柱条颜色
        itemStyle: {
          color: '#9BB8FF'
        },
        data: [0],
      },
      {
        name: '意向客户',
        type: 'bar',
        stack: 'lead',
        // 柱条颜色
        itemStyle: {
          color: '#91E9A8'
        },
        data: [0],
      },
      // 折线配置项
      {
        name: '总预算金额',
        type: 'line',
        itemStyle: {
          color: '#4072EE'
        },
        yAxisIndex: 1,
        symbol: 'circle', // 拐点实心
        smooth: true, // 平滑显示
        data: [0]
      }
    ]
  };

  // 流失情况图表配置项
  public lossChartOption: EChartOption = {
    tooltip: {
      // 坐标轴指示器，坐标轴触发有效
      trigger: 'axis',
      // 默认为直线，可选为：'line' | 'shadow'
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      show: false,
      top: 0,
      left: 30, // grid组件容器左侧的距离
      right: 20,
      bottom: 80
    },
    // x轴相关数据
    xAxis: [
      {
        type: 'category',
        // x轴刻度数据
        data: [0],
        // 坐标轴刻度相关设置
        axisTick: {
          show: false,
          alignWithLabel: true
        },
        // 坐标轴轴线相关设置
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#525471',
        },
      }
    ],
    // y轴相关数据
    yAxis: [
      {
        type: 'value',
        // 坐标轴刻度相关设置
        axisTick: {
          show: false
        },
        // 坐标轴轴线相关设置
        axisLine: {
          show: false
        },
        // 隐藏grid区域中的分割线
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#525471',
        },
      }
    ],
    series: [
      {
        name: '客户流失情况',
        type: 'bar',
        barWidth: '15px',
        // 图形样式
        itemStyle: {
          color: '#24a0d4'
        },
        // 高亮的图形样式
        emphasis: {
          // 标签
          label: {
            color: '#FC8282'
          },
          itemStyle: {
            color: '#FC8282'
          }
        },
        data: [0]
      }
    ]
  };

  constructor(
    private decimalPipe: DecimalPipe,
    private dataPipe: DatePipe,
    private http: HttpClient,
    private eventManager: EventManager
  ) { }

  ngOnInit() {
    // 监听屏幕的resize事件
    this.eventManager.addGlobalEventListener('window', 'resize', () => {
      // this.fullScreenConfig();
    });
    // this.fullScreenConfig();
    this.getData();
    this.refreshInterval = setInterval(() => {
      // 刷新页面时清除原来的列表滚动定时器
      clearInterval(this.orderTimer);
      this.getData();
    }, 5 * 60 * 1000);
  }

  /**
   * 页面逻辑函数
   * ***************************************************************
   * ***************************************************************
   */
  /**
   * 全屏与非全屏时的样式设置
   */
  private fullScreenConfig() {
    // window.innerHeight: 可视区域(浏览器窗口高度+滚动条高度)，screen.height:显示器的物理高度
    if (window.innerHeight === screen.height) {
      this.datas.teamShowNum = 10;
      this.datas.orderShowNum = 6;
      this.datas.goalShowNum = 5;
      this.datas.targetBoxHeight = '38%';
      this.datas.convertBoxHeight = '31%';
      this.datas.lossBoxHeight = 'calc(31% - 44px)';
    } else {
      this.datas.teamShowNum = 8;
      this.datas.orderShowNum = 5;
      this.datas.goalShowNum = 3;
      this.datas.targetBoxHeight = '37%';
      this.datas.convertBoxHeight = '36%';
      this.datas.lossBoxHeight = 'calc(27% - 44px)';
    }
  }
  /**
   * 初始化图表实例
   */
  public flowChartInit(ec) {
    this.instance.flowChart = ec;
  }
  public chinaMapInit(ec) {
    this.instance.chinaMap = ec;
    // 监听地图缩放事件，当放大倍数大于 x 则显示团队名称
    this.instance.chinaMap.on('georoam', () => {
      this.watchChinaMapZoom();
    });
  }

  private watchChinaMapZoom() {
    const zoom = this.instance.chinaMap.getOption()["geo"][0]["zoom"];
    const ifShowLabel = zoom > 12;
    if (zoom > 12) {
      echarts.registerMap("china", chinaCityJson);
    } else {
      echarts.registerMap("china", chinaJson);
    }
    this.instance.chinaMap.setOption({
      geo: {
        label: {
          show: ifShowLabel
        }
      },
      tooltip: {
        formatter: (params) => {
          const tooltipName = zoom > 12 ? params.value[4] : params.name;
          return `${tooltipName}: ${this.decimalPipe.transform(params.value[2])} 元`;
        }
      }
    });
  }

  public reserveChartInit(ec) {
    this.instance.reserveChart = ec;
  }
  public lossChartInit(ec) {
    this.instance.lossChart = ec;
  }

  /**
   * 获取到后台数据后重新渲染图表
   */
  public redrawChinaMap(res) {
    const result = [];
    let transaction_volume = [];
    const lngList = [];
    const latList = [];
    const center = [104.29785146779332, 35.854492420955694];
    if (res.length) {
      transaction_volume = res.map(item => {
        const obj = {
          name: item.city_name,
          value: [Number(item.wgs84_lng), Number(item.wgs84_lat), Number(item.transaction_volume),
          item.bubble_size.toFixed(), item.child_team_name]
        };
        result.push(obj);
        lngList.push(Number(item.wgs84_lng));
        latList.push(Number(item.wgs84_lat));
        return item.transaction_volume;
      });
      // 计算数据列表中最大/小的经纬度值
      const minLongitude = Math.min(...lngList);
      const maxLongitude = Math.max(...lngList);
      const minLatitude = Math.min(...latList);
      const maxLatitude = Math.max(...latList);
      // 经纬度跨度
      const longitudeSpan = maxLongitude - minLongitude;
      const latitudeSpan = maxLatitude - minLatitude;
      // 重新计算地图中心点的坐标
      const newLongitude = minLongitude + (maxLongitude - minLongitude) / 2;
      const newLatitude = minLatitude + (maxLatitude - minLatitude) / 2;
      // 经度跨度： 0 < longitudeSpan < 3; 纬度跨度: 0 < latitudeSpan < 6
      if ((longitudeSpan > 0 && longitudeSpan < 3) && (latitudeSpan > 0 && latitudeSpan < 6)) {
        // 经纬度跨度均小于1，重新定位中心坐标，放大至30倍，显示团队名称
        if (longitudeSpan < 1 && latitudeSpan < 1) {
          center[0] = newLongitude;
          center[1] = newLatitude;
          echarts.registerMap("china", chinaCityJson);
          this.chinaMapOption.geo.center = center;
          this.chinaMapOption.geo.zoom = 30;
          this.chinaMapOption.geo.label.show = true;
          this.chinaMapOption.tooltip.formatter = (params) => {
            const tooltipName = params.value[4];
            return `${tooltipName}: ${this.decimalPipe.transform(params.value[2])} 元`;
          };
        } else {
          center[0] = newLongitude;
          center[1] = newLatitude;
          this.chinaMapOption.geo.center = center;
          this.chinaMapOption.geo.zoom = 5;
        }
      }
      console.log('经度跨度： ' + longitudeSpan);
      console.log('纬度跨度: ' + latitudeSpan);
      console.log(center);
    }
    this.chinaMapOption.series[0]['data'] = result;
    if (this.instance.chinaMap) {
      // 缩放地图后刷新数据保持缩放状态
      this.instance.chinaMap.setOption({
        series: [{
          data: result
        }]
      });
    }
  }

  public redrawReserveChart(res) {
    // 图表x轴日期数据
    const xAxisData = [];
    // 潜在客户
    const potentialCountList = [];
    // 兴趣客户
    const interestCountList = [];
    // 意向客户
    const committedCountList = [];
    // 总预算金额
    const totalBudgetList = [];

    for (const key in res) {
      if (res.hasOwnProperty(key)) {
        const item = res[key];
        interestCountList.unshift(Number(item.interested_count));
        potentialCountList.unshift(Number(item.potential_count));
        committedCountList.unshift(Number(item.committed_count));
        totalBudgetList.unshift(Number(item.pic_total_value));
        xAxisData.unshift(item.stats_date);
      }
    }
    this.reserveChartOption.xAxis['data'] = xAxisData;
    this.reserveChartOption.series[0]['data'] = potentialCountList;
    this.reserveChartOption.series[1]['data'] = interestCountList;
    this.reserveChartOption.series[2]['data'] = committedCountList;
    this.reserveChartOption.series[3]['data'] = totalBudgetList;

    if (this.instance.reserveChart) {
      this.instance.reserveChart.clear(); // 清除原图表实例
      this.instance.reserveChart.setOption(this.reserveChartOption); // 重新赋值
    }
  }

  public redrawFlowChart(res) {
    // x轴数据
    const xAxisData = [];
    // y轴数据
    const yAxisData = [];

    for (const key in res) {
      if (res.hasOwnProperty(key)) {
        const item = res[key];
        xAxisData.push(key);
        yAxisData.push(item.lead + item.new_visitor + item.returning_visitor);
      }
    }
    this.flowChartOption.xAxis['data'] = xAxisData;
    this.flowChartOption.series[0]['data'] = yAxisData;
    if (this.instance.flowChart) {
      this.instance.flowChart.clear();
      this.instance.flowChart.setOption(this.flowChartOption, true);
    }
  }

  public redrawLossChart(res) {
    // x轴数据
    const xAxisData = [];
    // y轴数据
    const yAxisData = [];
    let index = 0;
    for (const key in res) {
      if (res.hasOwnProperty(key)) {
        const item = res[key];
        if (index < 6) {
          xAxisData.push(item.tag_name);
          yAxisData.push(item.tag_count);
        }
        index++;
      }
    }
    this.lossChartOption.xAxis[0]['data'] = xAxisData;
    this.lossChartOption.series[0]['data'] = yAxisData;
    if (this.instance.lossChart) {
      this.instance.lossChart.clear();
      this.instance.lossChart.setOption(this.lossChartOption, false);
    }
  }


  /**
   * 获取后台数据
   */
  private getData() {
    this.list = dashboardJson;
    // 截取订单列表的前n条
    this.orderList = this.list['team_transaction_list'].slice(0, 5);
    // 实时订单的滚动效果，每隔5s滚动一次
    this.orderTimer = setInterval(() => {
      if (this.orderList.length > 5) {
        this.orderList.push(this.orderList[0]);
        this.orderList.shift();
      }
      this.orderTimerFlag = false;
      // console.log(new Date().toLocaleString());
    }, 3000);

    // 重新渲染图表
    this.redrawReserveChart(this.list.lead_stage_stats.daily_log);
    this.redrawFlowChart(this.list.lead_traffic.historical);
    this.redrawLossChart(this.list.lead_loss_stats.tags_stats);
    this.redrawChinaMap(this.list.team_evaluation.region_stats);
  }

  ngOnDestroy() {
    // 销毁定时器
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    clearInterval(this.orderTimer);
  }
}
