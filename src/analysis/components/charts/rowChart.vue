<template>
  <view class="container">
    <text class="chart_title" v-if="cTitle">{{cTitle}}</text>
    <view class="chart_box">
      <f2 :onInit="onInitChart" v-if="cData.length" />
    </view>
  </view>
</template>

<script>
let data = []
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
    data = this.newData;
  },
  computed: {
    newData() {
      if (data.length) {
        chart.changeData(this.cData);
      }
      return this.cData;
    },
  },
  methods: {
    onInitChart(F2, config) {
      console.log(data);
      F2.Global.fontFamily = "sans-serif";
      chart = new F2.Chart(config);

      chart.source(data);
      chart.coord({
        transposed: true,
      });
      chart.tooltip({
        showItemMarker: false,
        onShow: function onShow(ev) {
          const items = ev.items;
          items[0].name = null;
          items[0].name = items[0].title;
          items[0].value = items[0].value + "条";
        },
      });
      chart.interval().position("name*value").color('l(90) 0:#1890ff 1:#70cdd0');;
      chart.render();
      return chart
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