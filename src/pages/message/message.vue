<template>
	<view class="container">
		<view>
			<tabs-swiper 
			class="tabs"
			ref="tabs" 
			:list="list" 
			:current="current" 
			@change="tabsChange"
			 swiperWidth="750" 
			 is-scroll="false"
			 gutter="300">
			 </tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="tab_swiper">
			<swiper-item class="tab_items" v-for="(item, index) in tabs" :key="index">
				<view class="no_result" v-if="item.type === 1 && !recommondList.length">暂无匹配到职位</view>
				<scroll-view scroll-y class="scroll_box" v-if="item.type === 1 && recommondList.length">
					<view class="item" 
					v-for="item in recommondList" 
					:key="item.positionId" 
					@click="toPosDetail" 
					:data-pid="item.positionId">
						<text class="title">为你匹配一条招聘信息</text>
						<view class="value">
							<view class="left">
								<image :src="item.companyLogo" mode="widthFix" />
							</view>
							<view class="right">
								<view class="r_top">
									<text>{{item.positionName}}</text>
									<text class="salary">{{item.salary}}</text>
								</view>
								<view class="r_middle">
									<text>{{item.companyShortName}}</text>
									<text class="point">·</text>
									<text>{{item.city}}</text>
									<text>{{item.workYear}}</text>
									<text>{{item.jobNature}}</text>
								</view>
								<view class="r_bottom">
									<text v-for="(el, index) in item.industryField" :key="index">{{el}}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-y class="scroll_box" v-if="item.type === 2">
					<view class="item">
						<button class="contact" open-type="contact" @contact="handleContact">
							<view class="iconfont icon-kefu"></view>
							<text>联系客服</text>
						</button>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
import TabsSwiper from '@/components/tabs-swiper/tabs-swiper'
import { matchPos } from '@/utils/api'
	export default {
		data() {
			return {
				list: [{
					name: '消息'
				}, {
					name: '小助手'
				}],
				tabs: [
					{	
						type: 1,
						name: '消息',
					 	content: [] 
					},
					{ 
						type: 2,
						name: '小助手' ,
						content: []
					}
				],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			};
		},
		onLoad() {
			let userLocation = ''
			if(this.userInfo.location) {
				userLocation = [this.userInfo.location]
			}
			let extraId = ''
			let hopeCity = ''
			let hopePos = ''
			if(this.userInfo.viewHistory) { extraId = this.userInfo.viewHistory }
			if(this.hopeCity) { hopeCity = [this.hopeCity] }
			if(this.hopePos ) { hopePos = [this.hopePos] }
			console.log(this.hopePos)
			this._matchPos({
					salary: this.hopeSalary,
					//调试时都为数组
					city: hopeCity || userLocation || (this.userHabit.cityList && this.userHabit.cityList.map(item => item[0])) || [],
					pos: hopePos || ( this.userHabit.typeList && this.userHabit.typeList.map(item => item[0])) || [],
					jobNature: this.hopeType,
					positionLables: this.userHabit.skillList && this.userHabit.skillList.map(item => item[0]) || [],
					extraId
				})
			
		},
		components: {
			TabsSwiper
		},
		computed: {
			...mapGetters([
				'hopeSalary',
				'hopeCity',
				'hopeType',
				'hopePos',
				'userInfo',
				'userHabit'
			]),
			recommondList() {
				let currList = []
				if(this.tabs[0].content.length) {
					currList = this.tabs[0].content.map((item) => {
						item.industryField = item.industryField.split(',')
						return item
					})
				}
				return currList
			}
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			handleContact(e) {
				console.log(e)
			},
			async _matchPos(filter) {
				let res = await matchPos(filter)
				console.log(filter)
				console.log(res.data)
				this.tabs[0].content = res.data.map((item) => {
					item.companyLogo = `//www.lgstatic.com/thumbnail_160x160/${item.companyLogo}`
					console.log(item.positionName.length)
					if(item.positionName.length > 9) {
						item.positionName = item.positionName.substr(0,9).concat('...')
					}
					if(item.companyShortName.length > 6) {
						item.companyShortName = item.companyShortName.substr(0,6).concat('...')
					}
					return item
				})
				
			},
			toPosDetail(e) {
				uni.navigateTo({
					 url: `../posDetail/posDetail?pid=${e.currentTarget.dataset.pid}`
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		.tabs {
			position: fixed;
			left: 0;
			top: 0;
			z-index: 99;
		}
		.tab_swiper {
			margin-top: 80rpx;
			width: 95%;
			height: 93vh;
			.tab_items {
				.no_result {
					display: flex;
					justify-content: center;
					font-size: $middle-size;
					margin-top: 200rpx;
					color: $middle-color;
				}
				.scroll_box {
					height: 100%;
					display: flex;
					flex-direction: column;
					.item {
						margin: 20rpx 0;
						width: 100%;
						height: 240rpx;
						border: 2rpx solid $border-color;
						box-shadow: 1rpx 2rpx 15rpx $circle-border-color;
						border-radius: 10rpx;
						display: flex;
						flex-direction: column;
						position: relative;
						&:first-of-type {
							margin: 0;
						}
						.title {
							flex: 2;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: $middle-size;
							color: $actived-color
						}
						.value {
							flex: 7;
							display: flex;
							.left {
								flex: 3;
								display: flex;
								justify-content: center;
								align-items: center;
								image {
									width: 60%;
								}
							}
							.right {
								flex: 7;
								display: flex;
								flex-direction: column;
								.r_top {
									display: flex;
									justify-content: space-between;
									padding: 10rpx 10rpx 0 10rpx;
									color: $main-color;
									font-size: $title-size;
									.salary {
										color: $salary-color;
									}
								}
								.r_middle {
									color: $middle-color;
									font-size: $middle-size;
									.point {
										font-weight: 500;
									}
									text {
										padding: 0 10rpx;
										&:nth-of-type(4), &:nth-of-type(5){
											border-left: 4rpx solid $border-color;
										}
									}
								}
								.r_bottom {
									margin-top: 10rpx;
									text {
										display: inline-block;
										font-size: $middle-size;
										color: $shallow-color;
										background-color: $back-color;
										padding: 0 10rpx;
										margin-right: 15rpx;
										border-radius: 8rpx;
									}
								}
							}
						}
						.contact {
							background-color: white;
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							text, .icon-kefu {
								color: $actived-color;
								font-weight: 450;
								font-size: 48rpx;
							}
							.icon-kefu {
								font-size: 55rpx;
								margin-right: 30rpx;
							}
						}
					}
				}
				
			}
		}
	}

</style>
