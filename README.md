
# EchartsDashboard数据大屏

基于 echarts 的地图数据大屏, 实现省级散点地图缩放；
自动定位数据坐标经纬度中心点

## 启动

```
$ git clone https://github.com/carrieXin/echarts-dashboard.git
$ npm install
$ ng serve
```

## 关键代码
```javascript
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

```

