<template>
  <view class="container">
    <text class="chart_title" v-if="cTitle">{{cTitle}}</text>
    <view class="chart_box">
      <f2 :onInit="onInitChart" v-if="cData.length" />
    </view>
  </view>
</template>

<script>
let data = [];
let chart = {};
export default {
  data() {
    return {};
  },
  props: {
    cData: {
      type: Array,
      default: [],
    },
    cTitle: {
      type: String,
      default: ''
    }
  },
  created() {
    console.log(this.cData);
    data = this.newData;
  },
  computed: {
    newData() {
      if (data.length) {
        chart.changeData(
          this.cData.sort((a, b) => {
            return a.value - b.value;
          })
        );
      }
      return this.cData.sort((a, b) => {
        return a.value - b.value;
      });
    },
  },
  methods: {
    onInitChart(F2, config) {
      F2.Global.fontFamily = "sans-serif";
      chart = new F2.Chart(config);
      chart.coord("polar", {
        transposed: true,
        endAngle: 2 * Math.PI,
        startAngle: Math.PI / 2,
        innerRadius: 0.1,
      });

      chart.source(data);

      chart.axis("name", {
        grid: false,
        line: null,
        label: (text, index, total) => {
          let fontSize = "";
          if (total === 5) {
            fontSize = "9";
          } else {
            fontSize = "11";
          }
          const cfg = {
            fontSize,
            fontWeight: "bold",
          };
          return cfg;
        },
        // label: {
        //   // fontSize: 12,
        //   // fontWeight: "bold",
        //   fill: "#7b7b7e"
        // }
      });
      chart.axis("value", false);
      chart.tooltip({
        showItemMarker: false,
        background: {
          radius: 2,
          fill: "#1890FF",
          padding: [3, 5],
        },
        onShow(ev) {
          const items = ev.items;
          items[0].name = items[0].title;
          items[0].value = items[0].value + "条";
        },
      });
      chart.legend("name", {
        position: "top",
      });
      chart
        .interval()
        .position("name*value")
        .color("name", ["#3366ff", "#00cc00", "#e5e600", "#000080", "#6600ff"]);
      chart.render();
      return chart;
    },
  },
};
</script>

<style lang="scss" scoped>
.chart_title {
  width: 100%;
  padding: 0 20rpx;
  margin: 10rpx 20rpx 0 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-left: 5rpx solid #1890ff;
  font-size: $middle-size;
  color: $middle-color;
}
.chart_box {
  width: 100%;
  height: 400rpx;
}
</style>