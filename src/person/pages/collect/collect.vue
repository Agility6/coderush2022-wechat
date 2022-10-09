<template>
	<view class="container">
		<view class="none" v-if="!userCollect.length">暂无收藏职位</view>
		<position-list :posList="userCollect" mode="collect" v-else></position-list>
	</view>
</template>

<script>
import PositionList from '@/components/positionList/positionList'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {

		}
	},
	components: {
		PositionList
	},
	computed: {
		...mapGetters([
			'userCollect'
		])
	}
}
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