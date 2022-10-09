<template>
  <view class="container" :style="height">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
  </view>
</template>

<script>
export default {
    props: {
        lHeight: {
            type: Number,
            default: 80
        }
    },
    computed: {
        height() {
            return `height: ${this.lHeight}rpx `
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
      .dot {
        margin: 10rpx;
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        background-color: $theme-color;
        animation: jump 1.5s infinite ease-in-out;
        @for $i from 1 through 6 {
            &:nth-of-type(#{$i}) {
                animation-delay: $i * .15s;
            }
        }
    }
    @keyframes jump {
      0% {
        transform: translateY(0);
        background: $theme-color;
      }
      25% {
        transform: translateY(-20px) scale(1.5);
        background: #3498db;
      }
      50% {
        transform: translateY(0);
        background: #9b59b6;
      }
      100% {
        transform: translateY(0);
        background: $theme-color;
      }
    }
  }
</style>