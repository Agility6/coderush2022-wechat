<template>
	<view class="container">
		<view class="index_top">
			<view class="top_title">
				<text>CodeRush</text>
			</view>
			<navigator url="../../filter/pages/search/search" class="top_search">
				<text class="text iconfont icon-icon_search"> 搜索职位/公司</text>
			</navigator>
		</view>
		<view class="index_swiper">
			<swiper indicator-dots autoplay :interval="3000" circular>
				<swiper-item v-for="(item, index) in pic" :key="index">
					<navigator>
						<image :src="item" mode="widthFix"></image>
					</navigator>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="index_navigator">
			<view class="navigator_box">
				<navigator url="../../analysis/pages/analysis/analysis" open-type="navigate">
					<text class="nav_title">今日数据</text><text class="iconfont icon-arrow-right"></text>
				</navigator>
			</view>
		</view>
		<view class="statistics">
			<statistics></statistics>
		</view> 
		<view class="index_navigator">
			<navigator url="../filter/filter?mode=index" open-type="navigate">
				<text class="nav_title">为你匹配</text><text class="iconfont icon-arrow-right"></text>
			</navigator>
		</view>
		<view class="position_list">
			<position-list :posList="loadedPosList" mode="point" :nomore="noMore"></position-list>
		</view>
	</view>
</template>

<script>
	import PositionList from '@/components/positionList/positionList.vue'
	import Statistics from '@/components/statistics/statistics.vue'
	import { mapActions,mapGetters } from 'vuex'
	import { getPosList, searchPos } from '@/utils/api'
	export default {
		data() {
			return {
				pic: [require("static/swiper (1).png"),
					require("static/swiper (2).png"),
					require("static/swiper (3).png")
				],
				currentPage: 1,
				noMore: false,
				noResult: false,
				key: ''
			}
		},
		onLoad() {
			this.key = this.hopePos
			if(this.hopePos || this.hopeCity || this.hopeType || this.hopeSalary) {
				this._searchPos(this.currentPage)
			}else {
				this._getPosList(this.currentPage)
			}

			//首次加载询问地址
			if(!this.userInfo.location) {
				uni.showModal({
					title: '请您确认当前位置~',
					cancelColor: '#888888',
					cancelText: '暂不',
					confirmText: '好的',
					success: (res) => {
						if(res.confirm) {
							uni.navigateTo({
								url: '../selectRegion/selectRegion?mode=search'
							})
						}
					}
				})
			}
		},
		onShow() {
			uni.$once('indexRequest', () => {
				this.key = this.hopePos
				this.currentPage = 1
				this.clearPosList()
				if(this.hopePos || this.hopeCity || this.hopeType || this.userInfo.location || this.hopeSalary) {
					this._searchPos(this.currentPage)
				}else {
					this._getPosList(this.currentPage)
				}
			})
		},
		onReachBottom() {
			this.currentPage ++
			if(this.noResult) {
				this._getPosList(this.currentPage)
			}else {
				this._searchPos(this.currentPage)
			}
		},
		onPullDownRefresh() {
			this.currentPage = 1
			this.clearPosList()
			// this.noResult = false
			if(this.hopePos || this.hopeCity || this.hopeType || this.userInfo.location || this.hopeSalary) {
				this._searchPos(this.currentPage)
			}else {
				this._getPosList(this.currentPage)
			}
			uni.stopPullDownRefresh()
		},
		components: {
			PositionList,
			Statistics
		},
		computed: {
			...mapGetters([
				'loadedPosList',
				'hopeSalary',
				'hopeCity',
				'hopeType',
				'hopeDate',
				'hopePos',
				'userInfo'
			])
		},
		methods: {
			...mapActions([
				'setLoadedPosList',
				'clearPosList'
			]),
			//分页获取信息，缓存到vuex中
			async _getPosList (page) {
				const res = await getPosList(page)
				let dataArr = res.data
				if(dataArr.length) {
					this.setLoadedPosList(dataArr)
					this.noMore = false
				}else {
					this.noMore = true
					uni.showToast({
						title: '已经到底了！',
						icon: 'none'
					});
				}
			},
			async _searchPos(page) {
				let filter = {}
				let city
				let key = ''
				if(this.hopePos !== '' && this.key) key = this.key.split('-')[1]
				if(this.hopeCity !== '') {
					city = this.hopeCity
				}else if(this.userInfo.location !== '') {
					city = this.userInfo.location
				}
				if(this.hopeType !== '') filter.jobNature = [this.hopeType]
				if(this.hopeSalary !== '') filter.salary = [this.hopeSalary]
				const res = await searchPos(key, city, page, filter)
				let dataArr = res.data
				if(dataArr.length) {
					this.setLoadedPosList(dataArr)
					this.noMore = false
				}else {
					if(!this.loadedPosList.length) {
						//没有结果的话设置为undefined
						this.key = undefined
						const newRes = await searchPos(this.key, city, page, filter)
						let newArr = newRes.data
						if(newArr.length) {
							this.setLoadedPosList(newArr)
						}else {
							this.noResult = true
							this._getPosList(page)
						}
					}else {
						//瀑布流，没有相应的结果时添加其他内容
						console.log('瀑布流')
						this.currentPage = 1
						this.noResult = true
						this._getPosList(this.currentPage)
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	.index_top {
		// background-color: $theme-color;
		background-image: linear-gradient(to bottom right, $theme-color, #6668e7);
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.top_title {
			height: 150rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			text{
				font-size: 80rpx;
				color: $border-color;
				font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
			}
		}
		.top_search {
			width: 90%;
			height: 70rpx;
			margin-bottom: 30rpx;
			background-color: white;
			border-radius: 35rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.text {
				color: $shallow-color;
				font-size: 30rpx;
			}
		}
		
	}
	.index_swiper {
		// background-color: $back-color;
		height: 340rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		swiper {
			height: 280rpx;
			width: 90%;
			border-radius: 8rpx;
			box-shadow: 1rpx 2rpx 12rpx #999999;
			swiper-item {
				border-radius: 8rpx;
			}
		}
	}
	.index_navigator {
		height: 100rpx;
		// background-color: $back-color;
		// border-top: 4rpx solid $back-color;
		border-bottom: 2rpx solid $back-color;
		.navigator_box, navigator {
			background-image: linear-gradient(to bottom right, #e5ccff3f, #ffffff);
			background-color: white;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			.nav_title {
				font-size: 36rpx;
				color: $main-color;
				margin: 0 10rpx 0 60rpx;
			}
		}
		.navigator_box {
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
		}
	}
	.statistics {
		width: 100%;
		height: 100%;
	}
	
}

</style>
