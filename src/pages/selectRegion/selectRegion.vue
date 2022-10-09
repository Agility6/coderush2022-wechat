<template>
	<view class="container">
		<scroll-view scroll-y class="left_list">
			<view
			v-for="(item, index) in leftList"
			:key="item.lid"
			:class="['left_item', {'actived':index===currentIndex}]"
			:data-index="item.lid"
			@click="selectCity">
			{{item.value}}
			</view>
		</scroll-view>
		<view class="right_list" v-if="currentIndex === 0">
			<text class="hot_title">当前定位</text>
			<text class="hot_location iconfont icon-icon_GPS" @click="getNowLocation">{{currentCity}}</text>
			<text class="hot_title second_title">热门城市</text>
			<view 
			class="right_item" 
			v-for="el in nowRightList"
			:key="el.rid"
			:data-city="el.value"
			@click="comfirmCity">
				{{el.value}}
			</view>
		</view>
		<view v-else class="right_list">
			<view 
			v-for="el in nowRightList" 
			:key="el.rid" 
			class="right_item"
			:data-city="el.value"
			@click="comfirmCity">
				{{el.value}}
			</view>
		</view>
	</view>
</template>

<script>
	import regions from './region.js'
	var QQMapWX = require('../../utils/qqmap-wx-jssdk')
	var qqmapsdk = new QQMapWX({
		key: 'GPJBZ-PLHWG-KAKQS-IJN24-AHFYH-2SBOB'
	});  
	export default {
		data() {
			return {
				leftList: [],
				rightList: [],
				currentIndex: 0,
				selectMode:'',
				currentCity:''
			};
		},
		onLoad(option) {
			this.selectMode = option.mode
			uni.getLocation({
				type: 'wgs84',
				success: (res) => {
					const data = { latitude: res.latitude, longitude: res.longitude }
					this.formatLoction(data)
				}
			});
		},
		created() {
			let arrs = regions[0].children
			//生成左边和右边的菜单栏数据
			arrs.map((item, index) => {
				this.leftList.push(
					{
						lid: index, 
						value: item.value.replace(/(省|自治区|特别行政区|回族|壮族|维吾尔)/g, ''), 
						children: item.children,
					}
				)
			})
			
		},
		computed: {
			nowRightList() {
				this.rightList = []
				this.leftList[this.currentIndex].children.map((el, i) => {
					if(el.value.indexOf('族') === -1) {
						this.rightList.push({rid: i, value: el.value.replace(/(市|自治州|特别行政区|地区|盟|区)/g, '').slice(0,4)})
					}
				})
				return this.rightList
			}
		},
		methods: {
			selectCity(e) {
				this.currentIndex = e.target.dataset.index
			},
			comfirmCity(e) {
				// this.$store.dispatch('setHopeData', { type: 'hopeCity', data: e.target.dataset.city })
				switch(this.selectMode) {
					case 'search':
						this.$store.dispatch('setUserInfo', { type: 'location', data: e.target.dataset.city })
						break
					case 'hope':
						this.$store.dispatch('setHopeData', { type: 'hopeCity', data: e.target.dataset.city })
						break
					case 'info':
						uni.$emit('resumeRegion', e.target.dataset.city)
				}
				uni.navigateBack({
					delta: 1
				})
			},
			formatLoction(location) {
				qqmapsdk.reverseGeocoder({
					location: location,
					success: (res) => {
						let city = res.result.address_component.city.replace("市", "")
						this.currentCity = city
					},
					fail: (err) => {
						console.log(err)
					},
				})
			},
			getNowLocation() {
				if(!this.currentCity) {
					uni.openSetting({
						success: (res) => {
							console.log(res.authSetting)
							uni.getLocation({
								type: 'wgs84',
								success: (res) => {
									const data = { latitude: res.latitude, longitude: res.longitude }
									this.formatLoction(data)
								}
							});
						}
					});
				}else {
					switch(this.selectMode) {
						case 'search':
							this.$store.dispatch('setUserInfo', { type: 'location', data: this.currentCity })
							break
						case 'hope':
							this.$store.dispatch('setHopeData', { type: 'hopeCity', data: this.currentCity })
							break
						case 'info':
							uni.$emit('resumeRegion', this.currentCity)
					}
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	.left_list {
		background-color: #f6f8f9;
		height: 100vh;
		flex: 2.5;
		display: flex;
		flex-direction: column;
		font-size: $main-size;
		color: $main-color;
		overflow: auto;
		.actived {
			border-right: 6rpx solid $theme-color;
			color: black;
			font-weight: 500;
		}
		.left_item {
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			justify-content: center;
		}
	}
	.right_list {
		flex: 7.5;
		margin: 20rpx;
		width: 100%;
		.hot_title{
			font-size: $main-size;
			color: $main-color;
			height: 80rpx;
			line-height: 80rpx;
			margin-left: 10rpx;
			display: block;
		}
		.second_title {
			margin-top: 100rpx;
		}
		.right_item, .hot_location{
			font-size: $main-size;
			color: $middle-color;
			width: 155rpx;
			padding: 10rpx 0;
			margin: 10rpx;
			border: 1rpx solid $circle-border-color;
			display: inline-flex;
			justify-content: center;
			align-items: center;
		}
		.hot_location {
			color: green;
			font-weight: 600;
		}
	}
}
</style>
