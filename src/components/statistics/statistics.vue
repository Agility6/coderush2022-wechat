<template>
  <view class="container">
    <view class="loading" v-if="isLoading">
      <m-loading lHeight="420"></m-loading>
    </view>
    <view class="main" v-else>
      <view
        v-for="(item, index) in dataObj"
        :key="index"
        class="data_box"
        :class="item.today - item.yesterday >= 0 ? add : minus"
      >
        <!-- <text class="box box_top">较昨日<text class="top_add add">+3088</text></text>
        <text class="box box_middle add">133888</text>-->
        <text class="box box_top">
          较昨日
          <text
            class="top_add add"
            v-if="item.today - item.yesterday >= 0"
          >+{{item.today - item.yesterday}}</text>
          <text class="top_add minus" v-else>{{item.today - item.yesterday}}</text>
        </text>
        <text
          class="box box_middle"
          :class="{ add: item.today - item.yesterday >= 0, minus: item.today - item.yesterday < 0 }"
        >{{item.today}}</text>
        <text class="box box_bottom">{{item.name}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getCompare } from "@/utils/api";
import MLoading from '@/components/mLoading/mLoading'
export default {
  data() {
    return {
      isLoading: true,
      dataObj: []
      // dataObj: [
      //   {
      //     name: "招聘数量",
      //     today: 138888,
      //     yesterday: 134688,
      //   },
      //   {
      //     name: "岗位",
      //     today: 2888,
      //     yesterday: 2788,
      //   },
      //   {
      //     name: "企业数量",
      //     today: 2888,
      //     yesterday: 2688,
      //   },
      //   {
      //     name: "城市数量",
      //     today: 108,
      //     yesterday: 110,
      //   },
      //   {
      //     name: "实习岗位",
      //     today: 988,
      //     yesterday: 1080,
      //   },
      //   {
      //     name: "一线城市",
      //     today: 18,
      //     yesterday: 18,
      //   },
      // ],
    };
  },
  created() {
    this._getCompare();
  },
  components: {
    MLoading
  },
  methods: {
    async _getCompare() {
      let res = await getCompare()
      this.dataObj = res.data
      this.isLoading = false
      console.log(res.data)
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .loading {
    // height: 420rpx;
  }
  .main {
    padding: 30rpx;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: 10rpx;
    grid-column-gap: 10rpx;
    .add {
      background-color: #e5ffe53f;
    }
    .minus {
      background-color: #ffe5f22f;
    }
    .data_box {
      height: 180rpx;
      border-radius: 10rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .box {
        flex: 3;
      }
      .box_top {
        color: $shallow-color;
        font-size: $middle-size;
      }
      .box_middle {
        flex: 4;
        font-size: 42rpx;
        font-weight: 500;
      }
      .box_bottom {
        color: $main-color;
        font-size: $middle-size;
        font-weight: 450;
      }
      .add {
        color: #00cc99;
      }
      .minus {
        color: #ff99cc;
      }
    }
  }
}
</style>