<template>
	<view class="container">
		<scroll-view 
		enable-back-to-top
		lower-threshold=200
		@scrolltolower="refreshPage"
		:scroll-y="isScroll" 
		class="position_list" 
		:class="[{position_scroll_list : isScroll}, {search_mode_list: mode === 'search'}]">
			<view class="list_item" v-for="item in nowPosList" :key="item.positionId">
				<mp-slideview 
				:buttons="slideButtons" 
				icon="true" 
				@buttontap="handleTap"
				:disable="mode === 'point'"
				:data-id="item.positionId">
					<view class="item_box" @click="toPosDetail" :data-pid="item.positionId">
						<image :src="item.companyLogo" mode="widthFix"></image>	
						<view class="item_detail">
							<view class="head">
								<text class="head_left">{{item.positionName}}</text>
								<text class="head_right">{{item.salary}}</text>
							</view>
							<view class="middle">
								<text class="company">{{item.companyShortName}}</text>
							</view>
							<view class="bottom">
								<text>{{item.city}}</text>
								<text>{{item.workYear}}</text>
								<text>{{item.education}}</text>
							</view>
						</view>
						<view class="label_box" v-if="item.famousCompany === 'True'">
							<view class="label">名企</view>
						</view>
					</view>
				</mp-slideview>
			</view>
			<text class="no_more" v-if="noMore">没有更多了</text>
		</scroll-view>
	</view>
</template>

<script>
import { mapGetters,mapActions } from 'vuex'
import { searchPos } from '../../utils/api'
	export default {
		props: {
			posList: {
				type: Array,
				default: []
			},
			mode: {
				type: String,
				default: ''
			},
			isScroll: {
				type: Boolean,
				default: false
			},
			//搜索列表属性
			searchKey: {
				type: String,
				default: ''
			},
			filter: {
				type: Object,
				default: {}
			},
			nomore: {
				type: Boolean,
				default: false
			}
		},
		created() {
			console.log(this.mode)
		},
		data() {
			return {
				searchCurrentPage: 1,
				noMore: false,
				posCache: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			]),
			nowPosList() {
				this.noMore = this.nomore
				let curList = []
				this.posList.map((item, index) => {
					let posName = ''
					if(item.positionName && item.positionName.length > 11) {
						posName = item.positionName.substr(0,11).concat('...')
					}else {
						posName = item.positionName
					}
					let obj = {
						positionId: item.positionId,
						companyLogo: item.companyLogo,
						positionName: posName,
						salary: item.salary,
						companyShortName: item.companyShortName,
						city: item.city,
						workYear: item.workYear,
						education: item.education,
						famousCompany: item.famousCompany
					}
					curList.push(obj)
					this.setUserInfo({ type: 'viewHistory', data: curList})
				})
				return curList
			},
			slideButtons() {
				return [
					{
						text: "删除",
						src: "/static/shanchu.svg"
					}
				]
			}

		},
		methods: {
			...mapActions([
				'setSearchedPosList',
				'deleteCollect',
				'setUserInfo',
				'deleteCommit'
			]),
			toPosDetail(e) {
				let pid = e.currentTarget.dataset.pid
				console.log(pid)
				if(this.mode === 'search' || this.mode === 'collect' || this.mode === 'history') {
					uni.navigateTo({
						url: `../../../pages/posDetail/posDetail?pid=${pid}`
					})
				}else {
					uni.navigateTo({
						url: `../../pages/posDetail/posDetail?pid=${pid}`
					})
				}
				
			},
			async _searchPos(key, location, page, filter) {
				const res = await searchPos(key,location, page, filter)
				this.setSearchedPosList(res.data)
				// this.resultList = res.data
				if(!res.data.length || JSON.stringify(this.posCache) === JSON.stringify(res.data)) {
					this.noMore = true
					uni.showToast({
						title: '已经到底了！',
						icon: 'none'
					})
				}
				this.posCache = res.data
			},
			refreshPage() {
				if(!this.noMore) {
					if(this.isScroll) {
						this.searchCurrentPage ++
						this._searchPos(this.searchKey, this.userInfo.location, this.searchCurrentPage, this.filter)
					}
				}
			},
			handleTap(e) {
				let pid = parseInt(e.currentTarget.dataset.id)
				if(this.mode === 'collect') {
					this.deleteCollect(pid)
					uni.showToast({
						title: '已取消'
					})
				}else if( this.mode === 'history') {
					this.deleteCommit(pid)
					uni.showToast({
						title: '已删除'
					})
				}
			}
		}
		
	}
</script>

<style scoped lang="scss">
.container {
	.position_list {
		height: 100%;
		background-color: $back-color;
		.list_item {
			.item_box {
				margin: 0 10rpx 10rpx 10rpx;
				border-radius: 30rpx;
				background-color: white;
				height: 170rpx;
				display: flex;
				align-items: center;
				border-top: 2rpx solid $border-color;
				position: relative;
				image {
					width: 120rpx;
					margin: 0 20rpx;
				}
				.item_detail {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					margin: 10rpx 0;
					.head {
						color: $main-color;
						padding-left: 20rpx;
						font-size: $main-size;
						position: relative;
						.head_left {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap
						}
						.head_right {
							position: absolute;
							right: 10rpx;
							color: $salary-color;
						}
					}
					.middle {
						color: $middle-color;
						font-size: $middle-size;
						padding-left: 20rpx;
					}
					.bottom {
						color: $shallow-color;
						font-size: $small-size;
						text {
							padding: 0 20rpx;
							&:nth-of-type(1),
							&:nth-of-type(2) {
								border-right: 2rpx solid $border-color;
							}
						}
					}
				}
				.label_box {
					width: 85rpx;
					height: 85rpx;
					overflow: hidden;
					position: absolute;
					bottom: -2rpx;
					right: -2rpx;
					.label {
						font: bold 20rpx Sans-Serif;
						color: #333;
						text-align: center;
						text-shadow: rgba(255,255,255,0.5) 0 1rpx 0;
						transform: rotate(-45deg);
						position: relative;
						padding: 7rpx;
						left: -5rpx;
						bottom: -38rpx;
						width: 120rpx;
						background-color: #BFDC7A;
						background-image: linear-gradient(top, #BFDC7A, #8EBF45);
						color: #6a6340;
						box-shadow: 0 0 3rpx rgba(0,0,0,0.3);
						&::before, &::after {
							content: "";
							border-top: 3rpx solid #6e8900;
							border-left: 3rpx solid transparent;
							border-right: 3rpx solid transparent;
							position: absolute;
							bottom: -3rpx;
						}
						&::before {
							left: 0;
						}
						&::after {
							right: 0;
						}
					}
				}
			}
		}
		.no_more {
			display: flex;
			height: 80rpx;
			justify-content: center;
			align-items: center;
			font-size: $main-size;
			color: $shallow-color
		}
	}
	.position_scroll_list {
		height: 87vh;
	}
	.search_mode_list {
		background-color: white;
	}
}

</style>
