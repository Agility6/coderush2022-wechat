<template>
  <view class="container">
    <view class="chart_box">
      <f2 :onInit="onInitChart" />
    </view>
  </view>
</template>

<script>
var data = [];
var chart = {}
export default {
  props: {
    cData: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
       
    };
  },
  created() {
    data = this.cData;
    console.log(data)
  },
  // beforeDestroy() {
  //     chart.clear()
  // },
  methods: {
    onInitChart(F2, config) {
      F2.Global.fontFamily = "sans-serif";
      chart = new F2.Chart(config);

      chart.coord("polar");
      chart.source(data, {
        value: {
          min: 0,
          max: 100,
          nice: false,
          tickCount: 6
        }
      });
      chart.legend({
        marker: {
            symbol: 'square',
            radius: 5
        },
        position: "top",
        align: "center",
        nameStyle: {
          fill: "#fff",
          fontSize: 14
        }, // 图例项 key 值文本样式
        valueStyle: {
          fill: "#fff",
          fontSize: 14,
          fontWeight: "bold" // 图例项 value 值文本样式
        }
      });
      chart.tooltip({
        custom: true, // 自定义 tooltip 内容框
        onShow: function onShow(obj) {
          const legend = chart.get("legendController").legends.top[0];
          const tooltipItems = obj.items;
          const legendItems = legend.items;
          const map = {};
          legendItems.forEach(function(item) {
            map[item.name] = item;
          });
          tooltipItems.forEach(function(item) {
            const name = item.name;
            let value = ''
            if(item.value <= 20) {
              value = '低'
            }else if(item.value > 20 && item.value <= 40) {
              value = '较低'
            }else if(item.value > 40 && item.value <= 60) {
              value = '一般'
            }else if(item.value > 60 && item.value <= 80) {
              value = '较高'
            }else {
              value = '高'
            }
            if (map[name]) {
              map[name].value = value;
            }
          });
          legend.setItems(Object.values(map));
        },
        onHide: function onHide() {
          const legend = chart.get("legendController").legends.top[0];
          legend.setItems(chart.getLegendItems().country);
        }
      });
      // chart.tooltip(false)
      chart.axis("name", {
          label: {
              fontSize: 14,
              fill: "#fff"
          }
      })
      chart.axis("value", {
        label: function label(text, index, total) {
          if (index === total - 1) {
            return null;
          }
          return {
            top: true
          };
        },
        grid: function grid(text) {
          //最外层实线
          if (text === "100") {
            return {
              lineDash: null
            };
          }
        },
        line: {
          top: false
        }
      });
      chart
        .area()
        .position("name*value")
        .color("type")
        .style({
            fillOpacity: 0.6
        })
        .animate({
          appear: {
            animation: "groupWaveIn"
          }
        });
      chart
        .point()
        .position("name*value")
        .color("type")
        .style({
          stroke: "#fff",
          lineWidth: 1
        })
        .animate({
          appear: {
            delay: 300
          }
        });
      chart.render();
      return chart;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .chart_title {
    width: 100%;
    padding: 0 20rpx;
    margin: 10rpx 20rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-left: 5rpx solid #1890ff;
    font-size: $middle-size;
    color: $middle-color;
  }
  .chart_box {
    background-color: #00004d;
    border-radius: 15rpx;
    width: 100%;
    height: 500rpx;
  }
}
</style>