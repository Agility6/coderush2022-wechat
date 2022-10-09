<template>
  <view class="container">
    <!-- 热门职位曲线对比图 -->
    <m-loading v-if="!showTrend" lHeight="400"></m-loading>
    <line-chart :cData="trendList" v-else cTitle="热门职位对比"></line-chart>
    <!-- <line-chart :cData="trendList" cTitle="热门职位对比" v-if="showTrend"></line-chart> -->
    <!-- 中间模块 -->
    <text v-if="hopeCity" class="chart_title">{{hopeCity}}市招聘数据分析</text>
    <text v-else class="chart_title">招聘数据分析</text>
    <m-loading v-if="!showSkill && !showRegion" lHeight="450"></m-loading>
    <view class="middle_box" v-else>
      <!-- 地区排行图 -->
      <circle-chart :cData="regionRank" class="circle_chart"></circle-chart>
      <!-- 当前技术栈排行 -->
      <column-chart :cData="skillRank" class="column_chart"></column-chart>
    </view>
    <!-- 工资分布图 -->
    <m-loading v-if="!showSalary" lHeight="450"></m-loading>
    <heat-chart :cData="salaryList" cTitle="工资分布图" v-else></heat-chart>
    <!-- 底部模块 -->
    <m-loading v-if="!showEdu && !showFinance" lHeight="450"></m-loading>
    <view class="bottom_box" v-else>
      <!-- 学历要求比例图 -->
      <!-- <pie-chart :cData="eduList" cTitle="学历要求比例" class="pie_chart" v-if="showEdu"></pie-chart> -->
      <pie-chart :cData="pieData" cTitle="学历要求比例" class="pie_chart"></pie-chart>
      <annular-chart :cData="annularData" cTitle="融资情况数据" class="annular_chart"></annular-chart>
    </view>

    <!-- 企业规模数据 -->
    <m-loading v-if="!showCompanySize" lHeight="450"></m-loading>
    <row-chart cTitle="企业规模数据" class="row_chart" :cData="companySizeList" v-else></row-chart>
  </view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LineChart from "../../components/charts/lineChart";
import ColumnChart from "../../components/charts/columnChart";
import CircleChart from "../../components/charts/circleChart";
import PieChart from "../../components/charts/pieChart";
import HeatChart from "../../components/charts/heatChart";
import RowChart from "../../components/charts/rowChart";
import MLoading from "@/components/mLoading/mLoading";
import AnnularChart from "../../components/charts/annularChart";
// import { posTrend } from '@/utils/api'

export default {
  data() {
    return {
      currentShow: false,

      showSkill: false,
      showRegion: false,
      showTrend: false,
      showSalary: false,
      showEdu: false,
      showCompanySize: false,
      showFinance: false,
      mySalary: [
        "3k及以下",
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
        "30K及以上",
      ],
      lineData: [
        { date: "1-10", type: "能源", value: 98 },
        { date: "1-10", type: "金属", value: 96 },
        { date: "1-10", type: "农副产品", value: 68 },
        { date: "2-10", type: "能源", value: 101 },
        { date: "2-10", type: "金属", value: 112 },
        { date: "2-10", type: "农副产品", value: 78 },
        { date: "3-10", type: "能源", value: 100 },
        { date: "3-10", type: "金属", value: 99 },
        { date: "3-10", type: "农副产品", value: 91 },
        { date: "4-10", type: "能源", value: 104 },
        { date: "4-10", type: "金属", value: 108 },
        { date: "4-10", type: "农副产品", value: 93 },
        { date: "5-10", type: "能源", value: 95 },
        { date: "5-10", type: "金属", value: 96 },
        { date: "5-10", type: "农副产品", value: 92 },
        { date: "6-10", type: "能源", value: 95 },
        { date: "6-10", type: "金属", value: 89 },
        { date: "6-10", type: "农副产品", value: 92 },
        { date: "7-10", type: "能源", value: 140 },
        { date: "7-10", type: "金属", value: 120 },
        { date: "7-10", type: "农副产品", value: 107 },
      ],
      // heatData: [
      //   { name: "不限", value: [3, 1, 5, 9, 4, 1, 1, 7, 2, 0, 1, 0] },
      //   { name: "应届毕业生", value: [5, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0] },
      //   { name: "1年以下", value: [2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      //   { name: "1-3年", value: [1, 1, 14, 29, 31, 9, 0, 6, 3, 0, 2, 0] },
      //   { name: "3-5年", value: [0, 1, 3, 9, 34, 16, 8, 49, 33, 0, 11, 0] },
      //   { name: "5-10年", value: [0, 0, 0, 0, 2, 5, 3, 15, 27, 1, 15, 0] },
      //   { name: "10年以上", value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      // ],
      pieData: [
        {
          name: "不限",
          value: 84,
          const: "const",
        },
        {
          name: "大专",
          value: 126,
          const: "const",
        },
        {
          name: "本科",
          value: 1125,
          const: "const",
        },
        {
          name: "硕士",
          value: 17,
          const: "const",
        },
        {
          name: "博士",
          value: 3,
          const: "const",
        },
      ],
      // rowData: [
      //   {
      //     name: "少于15人",
      //     value: 38,
      //   },
      //   {
      //     name: "15-50人",
      //     value: 52,
      //   },
      //   {
      //     name: "50-150人",
      //     value: 61,
      //   },
      //   {
      //     name: "150-500人",
      //     value: 145,
      //   },
      //   {
      //     name: "500-2000人",
      //     value: 48,
      //   },
      //   {
      //     name: "2000人以上",
      //     value: 68,
      //   }
      // ],
      annularData: [
        {
          const: "const",
          name: "未融资",
          value: 38,
        },
        {
          const: "const",
          name: "A轮",
          value: 61,
        },
        {
          const: "const",
          name: "B轮",
          value: 145,
        },
        {
          const: "const",
          name: "C轮",
          value: 48,
        },
        {
          const: "const",
          name: "D轮及以上",
          value: 35,
        },
        {
          const: "const",
          name: "上市公司",
          value: 58,
        },
        {
          const: "const",
          name: "不需要融资",
          value: 18,
        },
      ],
    };
  },
  onLoad() {
    setTimeout(() => {
      this.currentShow = true;
    }, 300);

    let firstHopeObj = uni.getStorageSync("hopeObj");
    let isEmpty = true;
    Object.values(firstHopeObj).map((item, index) => {
      if (item) {
        console.log(index);
        isEmpty = false;
      }
    });
    if (uni.getStorageSync("hopeObj") && !isEmpty) {
      this.setReady(firstHopeObj).then(() => {
        if (this.skillRank.length) {
          this.showSkill = true;
        }
        if (this.regionRank.length) {
          this.showRegion = true;
        }
        if (this.salaryList.length) {
          this.showSalary = true;
        }
        if (this.eduList.length) {
          this.showEdu = true;
        }
        if (this.companySizeList.length) {
          this.showCompanySize = true;
        }
        if (this.FinanceList.length) {
          this.showFinance = true;
        }
        if (this.trendList.length) {
          this.showTrend = true;
        }
      });
    } else {
      this.setHopeData({ type: "noHope" }).then(() => {
        if (this.skillRank.length) {
          this.showSkill = true;
        }
        if (this.regionRank.length) {
          this.showRegion = true;
        }
        if (this.salaryList.length) {
          this.showSalary = true;
        }
        if (this.eduList.length) {
          this.showEdu = true;
        }
        if (this.companySizeList.length) {
          this.showCompanySize = true;
        }
        if (this.FinanceList.length) {
          this.showFinance = true;
        }
        if (this.trendList.length) {
          this.showTrend = true;
        }
      });
    }
  },
  components: {
    LineChart,
    ColumnChart,
    CircleChart,
    PieChart,
    HeatChart,
    RowChart,
    MLoading,
    AnnularChart,
  },
  computed: {
    ...mapGetters([
      "hopeCity",
      "regionRank",
      "skillRank",
      "salaryList",
      "trendList",
      "eduList",
      "companySizeList",
      "FinanceList",
    ]),
  },
  methods: {
    ...mapActions(["setHopeData", "setReady"]),
    // async _posTrend(city) {
    //     let res = await posTrend(city)
    //     this.lineData = res.data
    //     console.log(res.data)
    // }
  },
};
</script>

<style lang="scss" scoped>
.container {
  .line {
    height: 100%;
    width: 100%;
  }
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
    width: 100%;
    height: 100%;
  }
  .middle_box {
    display: flex;
    .circle_chart {
      flex: 4.5;
    }
    .column_chart {
      flex: 5.5;
    }
  }
  .bottom_box {
    display: flex;
    .pie_chart {
      flex: 4.5;
    }
    .annular_chart {
      flex: 5.5;
    }
  }
  .row_chart {
    height: 450rpx;
    width: 100%;
  }
}
</style>
