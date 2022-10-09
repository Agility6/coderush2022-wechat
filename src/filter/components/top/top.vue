<template>
	<view class="top">
		<!-- 把location设置为false时不适用位置组件 -->
		<navigator 
		hover-class="none"
		url="../../../pages/selectRegion/selectRegion?mode=search" 
		class="top_location" 
		:class="{'none':location === 'false'}"
		v-if="!nowComfirm"
		>
			<text v-if="location" class="in_location" >
				{{location}}
				<text class="iconfont icon-arrow-down"></text>
			</text>
			<text v-else class="iconfont icon-icon_GPS"></text>
		</navigator>
		<view class="top_input">
			<text class="iconfont icon-icon_search"></text>
			<input v-model="inputData" @input="watchInput">
			<text class="iconfont icon-close" v-if="inputData" @click="clearInput"></text>
		</view>
		<view v-if="!nowComfirm">
			<view v-if="!inputData.trim()" class="top_cancel" @click="handleCancel">取消</view>
			<view v-else class="top_cancel" @click="handleOk">完成</view>
		</view>
		
	</view>
</template>

<script>
import {debounce} from '@/utils/utils'
import {mapGetters, mapActions} from 'vuex'
	export default {
		data() {
			return {
				inputData: '',
				mIsComfirm: false
			}
		},
		props: {
			location: {
				type: String,
				default: ''
			},
			nowInput: {
				type: String,
				default: ''
			},
			isComfirm: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			nowInput: function(newVal) {
				this.inputData = newVal
			}
		},
		computed: {
			...mapGetters([
				'searchHistory'
				]),
			nowComfirm() {
				return this.isComfirm || this.mIsComfirm
			}
		},
		methods: {
			...mapActions([
				'setSearchHistory'
			]),
			handleCancel() {
				uni.navigateBack({
					 delta: 1
				});
			},
			handleOk() {
				this.mIsComfirm = true
				uni.$emit('request', this.inputData)
				// this.$emit('searchPos', this.inputData)
				const length = this.searchHistory.length
				if(!length) {
                    this.setSearchHistory({ value: this.inputData, id: 0})
                }else {
                    this.setSearchHistory({ value: this.inputData, id: length})
                }
			},
			clearInput() {
				this.inputData = ''
				this.$emit('searchPos', this.inputData)
				this.mIsComfirm = false
			},
			watchInput() {
				this.$emit('searchPos', this.inputData)
				this.mIsComfirm = false
			}
			
		}
	}
</script>

<style scoped lang="scss">
	.top {
		display: flex;
		height:80rpx;
		color: $main-color;
		padding: 10rpx 0;
		font-size: $main-size;
		
		.iconfont {
			font-size: $title-size;
		}
		.top_location, .top_cancel {
			width: 110rpx;
			max-width: 110rpx;
			display: flex;
			line-height: 60rpx;
			.in_location {
				overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
			}
			.icon-icon_GPS {
				color: $middle-color;
				margin-left: 30rpx;
			}
		}
		.top_cancel {
			width: 90rpx;
			justify-content: flex-end;
		}
		.top_input {
			flex: 1;
			display: flex;
			align-items: center;
			border: 2rpx solid $circle-border-color;
			border-radius: 30rpx;
			margin: 0;
			.icon-icon_search {
				color: $circle-border-color;
				margin-left: 20rpx;
			}
			input {
				width: 100%;
				height: 60rpx;
				margin: 0 10rpx 0 20rpx;
			}
			.icon-close {
				margin-right: 10rpx;
				color: $main-color
			}
		}
		.none {
			display: none;
		}
	}
</style>
