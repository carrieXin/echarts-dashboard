import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // 散点数据
  private data = [
    {
      name: "大庆",
      value: [125.03, 46.58, 279]
    },
    {
      name: "武汉",
      value: [114.31, 30.52, 273]
    },
    {
      name: "合肥",
      value: [117.27, 31.86, 229]
    },
    {
      name: "菏泽",
      value: [115.480656, 35.23375, 194]
    },
    {
      name: "廊坊",
      value: [116.7, 39.53, 193]
    },
    {
      name: "衢州",
      value: [118.88, 28.97, 177]
    }
  ];

  public chartInstance;
  public option = {
    backgroundColor: "transparent",
    title: {
      text: "全国主要城市空气质量",
      left: "center",
      textStyle: {
        color: "#fff"
      }
    },
    tooltip: {
      trigger: "item"
    },
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 5,
      roam: true,
      mapStyle: {
        styleJson: [{
          "featureType": "land",
          "elementType": "geometry",
          "stylers": {
            "visibility": "on",
            "color": "#559AEBff"
          }
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": {
            "visibility": "on",
            "color": "#080B34ff"
          },
        },
        {
          "featureType": "city",
          "elementType": "labels.icon",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "city",
          "elementType": "labels.text.fill",
          "stylers": {
            "color": "#2D1AD8ff"
          }
        }, {
          "featureType": "city",
          "elementType": "labels.text.stroke",
          "stylers": {
            "color": "#ffffff00"
          }
        },
        {
          "featureType": "district",
          "elementType": "labels.icon",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "district",
          "elementType": "labels.text.fill",
          "stylers": {
            "color": "#2D1AD8ff"
          }
        }, {
          "featureType": "district",
          "elementType": "labels.text.stroke",
          "stylers": {
            "color": "#ffffff00"
          }
        },
        {
          "featureType": "town",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        },
        // 隐藏所有人造陆地
        {
          "featureType": "manmade",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "building",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "green",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "poilabel",
          "elementType": "labels",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "scenicspotslabel",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        },
        {
          "featureType": "subway",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        }
        ]
      }
    },
    series: [
      {
        name: "pm2.5",
        type: "scatter",
        coordinateSystem: "bmap",
        data: this.data,
        encode: {
          value: 2
        },
        symbolSize: (val) => {
          return val[2] / 10;
        },
        label: {
          formatter: "{b}",
          position: "right"
        },
        itemStyle: {
          color: "#ddb926"
        },
        emphasis: {
          label: {
            show: true
          }
        }
      }
    ]
  };

  dynamicTitle = 'Title';
  constructor(
    private router: Router,
    private joyrideService: JoyrideService
  ) { }

  ngOnInit() {

  }

  public chartInit(event) {
    this.chartInstance = event;
    this.chartInstance.setOption(this.option);
    // 获取bmap 实例，监听当前地图放大级别
    const bmap = this.chartInstance.getModel().getComponent('bmap').getBMap();
    bmap.setMinZoom(4);
    bmap.setMaxZoom(14);
    bmap.addEventListener('zoomend', () => {
      const flag = bmap.getZoom();
      console.log("当前放大级别: " + flag);
    });
  }
}
