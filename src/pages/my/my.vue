<template>
	<view class="container">
		<view class="my_info">
			<view class="my_login">
				<text class="login_big">{{nowUserInfo.name}}</text>
				<text class="login_small">{{nowUserInfo.detail}}</text>
				<button v-if="!userInfo" class="login_btn" open-type="getUserInfo" @getuserinfo="handleUserInfo" lang="zh_CN"></button>
			</view>
			<view class="my_avatar">
				<image :src="nowUserInfo.avatar" mode="widthFix"></image>
			</view>
		</view>
		<view class="my_setting" >
			<view v-for="(item, index) in settingList" :key="index">
				<cell cType="navigator" :cUrl="item.url" isSlot :bottom="index === settingList.length-1">
					<text class="iconfont" :class="item.class">
						<text class="title">{{item.name}}</text>
					</text>
				</cell>
			</view>
			<view v-if="userInfo" class="my_logout" @click="handleLogout">
				退出登录
			</view>
		</view>
	</view>
</template>

<script>
import cell from '@/components/cell/cell'
	export default {
		data() {
			return {
				originInfo: {
					name: "未登录/注册(Test语句~)",
					detail: "点击头像可登陆、注册",
					avatar: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=145692761,4091651670&fm=26&gp=0.jpg"
				},
				settingList: [
					{ name: '在线简历', class: 'icon-feeds', url: '../../person/pages/resumeOnline/resumeOnline'},
					{ name: '附件简历', class: 'icon-folder', url: '../../person/pages/resumeAttachment/resumeAttachment'},
					{ name: '投递记录', class: 'icon-history', url: '../../person/pages/history/history'},
					{ name: '我的收藏', class: 'icon-collection', url: '../../person/pages/collect/collect'},
					{ name: '设置', class: 'icon-zhanghucaozuo', url: '../../person/pages/setting/setting'}
				],
				userInfo: null
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		computed: {
			nowUserInfo() {
				if(this.userInfo) {
					return this.userInfo
				}else {
					return this.originInfo
				}
			}
		},
		components: {
			cell
		},
		methods: {
			handleUserInfo(e) {
				console.log(e)
				if(e.target.userInfo) {
					const info = e.detail.userInfo
					const _userInfo = {
						name: info.nickName,
						detail: info.province + " " +info.city,
						avatar: info.avatarUrl
					}
					// this.$store.dispatch('setUserInfo', _userInfo)
					this.userInfo = _userInfo
					uni.setStorageSync('userInfo', _userInfo)
				}else {
					return
				}
			},
			handleLogout() {
				uni.showModal({
					content: "确认退出当前账号？",
					confirmColor: "#3a3cd7",
					success: (res) => {
						if(res.confirm) {
							uni.removeStorageSync('userInfo')
							this.userInfo = null
							// this.$store.dispatch('setUserInfo', null)
							uni.showToast({
								title: "退出成功"
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		.my_info {
			width: 100%;
			height: 200rpx;
			background-color: $theme-color;
			display: flex;
			position: relative;
			.my_login {
				flex: 6;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0 80rpx;
				color: $border-color;
				.login_big {
					font-size: 48rpx;
				}
				.login_small {
					font-size: 28rpx
				}
			}
			.my_avatar {
				flex: 4;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 60%;
					border-radius: 50%;
				}
			}
			.login_btn {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
		}
		.my_setting {
			width: 100%;
			.iconfont {
				font-size: 50rpx;
				color: $main-color;
				.title {
					margin-left: 30rpx;
					font-size: 34rpx;
				}
			}
			.my_logout {
				margin-top: 50rpx;
				text-align: center;
				font-size: 32rpx;
				color: #888888;
			}
		}
	}
</style>
