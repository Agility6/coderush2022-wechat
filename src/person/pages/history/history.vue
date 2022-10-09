<template>
  <view class="container">
    <view class="none" v-if="!userCommit.length">暂无投递历史</view>
    <position-list :posList="userCommit" mode="history" v-else></position-list>
  </view>
</template>

<script>
import PositionList from "@/components/positionList/positionList";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  components: {
    PositionList,
  },
  computed: {
    ...mapGetters(["userCommit"]),
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: $back-color;
  position: relative;
  .none {
    position: absolute;
    top: 300rpx;
    left: 38%;
    color: $middle-color;
  }
}
</style>
