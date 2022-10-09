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
      default: "",
    },
  },
  created() {
    data = this.newData;
    console.log('heat')
  },
  computed: {
    newData() {
      if (data.length) {
        chart.changeData(this.cData);
      }
      return this.cData;
    },
    newData() {
      let list = [];
      this.cData.map((item) => {
        item.value.map((valueItem, valueIndex) => {
          list.push({ y: item.name, x: valueIndex, value: valueItem });
        });
      });
      if (data.length) {
        chart.changeData(list);
      }
      return list;
    },
  },
  methods: {
    onInitChart(F2, config) {
      F2.Global.fontFamily = "sans-serif";
      chart = new F2.Chart(config);
      chart.source(data, {
        x: {
          type: "cat",
          values: [
            "≤3k",
            "4k",
            "6k",
            "8k",
            "10k",
            "12k",
            "14k",
            "16k",
            "20k",
            "24k",
            "28k",
            "≥30K",
          ],
        },
      });

      chart
        .polygon()
        .position("x*y")
        .color("value", "#BAE7FF-#1890FF-#0050B3")
        .style({
          lineWidth: 1,
          stroke: "#fff",
        })
        .animate({
          appear: {
            animation: "fadeIn",
            duration: 800,
          },
        });
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
  height: 450rpx;
}
</style>