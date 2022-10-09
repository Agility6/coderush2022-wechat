<template>
  <view class="bottom">
    <view class="mash"></view>
    <view class="main">
      <view class="share">
        <text class="iconfont icon-share"></text>
        <text class="in_text">分享</text>
        <button class="share_btn" open-type="share"></button>
      </view>
      <view class="collect" @click="handleCollect">
        <text class="iconfont icon-collection" v-if="!isCollect"></text>
        <text class="iconfont icon-collection-fill" v-else></text>
        <text class="in_text">收藏</text>
      </view>
      <view class="submited" v-if="isCommit">投递简历</view>
      <view class="submit" @click="handleSubmit" v-else>投递简历</view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    bData: {
      type: Object,
      default: {},
    },
    pid: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      // isCollect: false
    };
  },
  computed: {
    ...mapGetters(["userCollect", "userCommit"]),
    isCollect() {
      let flag = false;
      if (this.userCollect.length) {
        this.userCollect.map((item) => {
          if (parseInt(item.positionId) === this.pid) {
            flag = true;
          }
        });
      }
      return flag;
    },
    isCommit() {
      let flag = false;
      if (this.userCommit.length) {
        if (
          this.userCommit.some((item) => {
            return parseInt(item.positionId) === this.pid;
          })
        ) {
          flag = true;
        }
      }
      return flag;
    },
  },
  methods: {
    ...mapActions(["setCollect", "deleteCollect", "setCommit"]),
    handleCollect() {
      if (!this.isCollect) {
        this.setCollect(this.bData);
        uni.showToast({
          title: "收藏成功",
        });
      } else {
        this.deleteCollect(this.pid);
        uni.showToast({
          title: "已取消",
        });
      }
    },
    handleSubmit() {
      uni.showActionSheet({
        itemList: ["在线简历", "附件简历"],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.navigateTo({
              url: `../../person/pages/resumeOnline/resumeOnline?mode=submit&posObj=${ JSON.stringify(this.bData) }`,
            });
          } else {
            uni.navigateTo({
              url:
                `../../person/pages/resumeAttachment/resumeAttachment?mode=submit&posObj=${ JSON.stringify(this.bData) }`,
            });
          }
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.bottom {
  position: relative;
  height: 120rpx;
  .mash {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: white;
    opacity: 0.9;
    z-index: -1;
  }
  .main {
    height: 100%;
    width: 90%;
    display: flex;
    padding: 20rpx 0;
    font-size: $middle-size;
    font-weight: 340;
    .share,
    .collect {
      flex: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: $middle-color;
      font-size: 24rpx;
      position: relative;
      .in_text {
        position: absolute;
        top: 55rpx;
      }
      .iconfont {
        font-size: 48rpx;
        padding: 0;
        margin: 0;
      }
    }
    .share {
      color: #309263;
      position: relative;
      .share_btn {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
    .submited {
      background-color: $shallow-color;
      flex: 6;
      color: white;
      font-size: $main-size;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .submit {
      background-color: #309263;
      flex: 6;
      color: $border-color;
      font-size: $main-size;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
