<template>
	<view class="container">
		<!-- 求职意向 -->
		<navigator url="../../../pages/filter/filter?mode=resume" open-type="navigate" class="filter">
			<text class="iconfont icon-feeds"></text>
			<text class="filter_text">求职意向</text>
		</navigator>
		<!-- 基本信息 -->
		<view class="no_info" v-if="!resumeInfo.name">
			<text class="iconfont icon-tubiao09" @click="toEditInfo">编辑</text>
			请完善您的基本信息
		</view>
		<view class="base_info" v-else>
			<view class="info_top">
				<view class="top_info">
					<text class="name">{{resumeInfo.name}}</text>
					<text class="iconfont icon-tubiao09" @click="toEditInfo">编辑</text>
					<view class="info_box">
						<text class="info">{{resumeInfo.sex}}</text>
						<text class="info">{{resumeInfo.date}}</text> 
						<text class="info">{{resumeInfo.currentCity}}</text>
						<text class="info">{{resumeInfo.status}}</text>
					</view>
				</view>
				<view class="top_avatar">
					<image :src="avatarSrc" mode="aspectFill" @click="changeAvatar" />
				</view>
			</view>
			<view class="info_bottom">
				<text class="phone"><text class="iconfont icon-ipad"></text>{{resumeInfo.phone}}</text>
				<text class="email"><text class="iconfont icon-email"></text>{{resumeInfo.email}}</text>
			</view>
		</view>
		<!-- 教育经历 -->
		<view class="experience">
			<text class="title">教育经历</text>
			<view class="edu_list" v-for="item in eduList" :key="item.eid">
				<view class="education_box" >
					<view class="pic">
						<image src="http://pic.51yuansu.com/pic2/cover/00/48/39/5815e9f0e7445_610.jpg" mode="widthFix" />
					</view>
					<view class="info_box">
						<text class="school">{{item.schoolName}}</text>
						<text class="education">{{item.edu}}</text>
						<text class="major">{{item.major}}</text>
						<text class="during">{{item.during}}</text>
					</view>
					<view class="edu_option">
						<text class="iconfont icon-tubiao09" @click="toExperience" :data-eid="item.eid"></text>
					</view>
				</view>
			</view>
			<view class="add_experience" @click="toExperience"><text class="add">+</text>添加教育经历</view>
		</view>
		<!-- 项目经验 -->
		<view class="project">
			<text class="title">项目经验</text>
			<view class="project_box" v-for="item in projList" :key="item.pid">
				<text class="iconfont icon-tubiao09" @click="toProject" :data-pid="item.pid"></text>
				<text class="name item">{{item.name}}</text>
				<text class="position item">{{item.position}}</text>
				<text class="during item">{{item.during}}</text>
				<view v-if="item.introduce">
					<text class="in_title item">项目内容</text>
					<text class="content item">{{item.introduce}}</text>
				</view>
			</view>
			<view class="add_project" @click="toProject"><text class="add">+</text>添加项目经验</view>
		</view>
		<view class="submit_box" v-if="mode === 'submit'">
			<button class="submit" @click="handleSubmit">提交简历</button>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	data() {
		return {
			avatarSrc: '',
			mode: '',
			posData: {}
		}
	},
	onLoad(options) {
		this.mode = options.mode
		this.posData = JSON.parse(options.posObj)
		// 监听从裁剪页发布的事件，获得裁剪结果
		uni.$on('uAvatarCropper', path => {
			this.avatarSrc = path;
			uni.setStorageSync('resumeAvatar', this.avatarSrc)
			//上传到服务器
			// uni.uploadFile({
			// 	url: 'http://192.168.0.6:3000/postAvatar',
			// 	filePath: path,
			// 	name: 'avatar',
			// 	success: (res) => {
			// 		console.log(res)
			// 	}
			// });
		})
	},
	onShow() {
		if(this.resumeInfo.name) {
			//模拟从服务器获取头像
			let _avatar = uni.getStorageSync('resumeAvatar')
			if(_avatar) {
				this.avatarSrc = _avatar 
			}else {
				console.log(this.resumeInfo.sex)
				if(this.resumeInfo && this.resumeInfo.sex === '男') {
					this.avatarSrc = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2519824424,1132423651&fm=26&gp=0.jpg'
				}else {
					this.avatarSrc = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1990878085,321872653&fm=26&gp=0.jpg'
				}
			}
		}
	},
	computed: {
		...mapGetters([
			'eduInfo',
			'projInfo',
			'resumeInfo'
		]),
		eduList() {
			if(this.eduInfo.length) {
				let list = []
				this.eduInfo.map((item, index) => {
					let {eid, schoolName, edu, major} = item 
					list.push({eid, schoolName, edu, major, during: `${item.eduStartDate}-${item.eduEndDate}`})
				})
				return list
			}else {
				return []
			}
		},
		projList() {
			if(this.projInfo.length) {
				let list = []
				this.projInfo.map((item, index) => {
					let {pid, name, position, introduce} = item 
					list.push({pid, name, position, introduce, during: `${item.startDate}-${item.endDate}`})
				})
				return list
			}else {
				return []
			}
		}
	},
	methods: {
		...mapActions([
			'setCommit'
		]),
		toEditInfo() {
			uni.navigateTo({
				 url: '../editInfo/editInfo'
			});
		},
		changeAvatar() {
			uni.navigateTo({
				 url: '../avatar-cropper/avatar-cropper?destWidth=300&rectWidth=300'
			});
		},
		toExperience(e) {
			if(e.currentTarget.dataset.eid) {
				uni.navigateTo({
					url: `../editEducation/editEducation?mode=edit&eid=${e.currentTarget.dataset.eid}`
				});
			}else {
				uni.navigateTo({
					url: `../editEducation/editEducation?mode=create`
				});
			}
			
		},
		toProject(e) {
			console.log(e.currentTarget.dataset.pid)
			if(e.currentTarget.dataset.pid) {
				uni.navigateTo({
					url: `../editProject/editProject?mode=edit&pid=${e.currentTarget.dataset.pid}`
				});
			}else {
				uni.navigateTo({
					url: '../editProject/editProject?mode=create'
				});
			}
			
		},
		handleSubmit() {
			console.log(this.posData)
			this.setCommit(this.posData)
			uni.showToast({
				title: '假装提交成功',
				duration: 1500
			}).then(() => {
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					},1500)
				});
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	background-color: $back-color;
	.filter {
		background-color: white;
		display: flex;
		height: 100rpx;
		.icon-feeds {
			flex: 2;
			display: flex;
			padding-left: 50rpx;
			align-items: center;
			font-size: 60rpx;
			color: #ff9900;
		}
		.filter_text {
			flex: 8;
			display: flex;
			align-items: center;
			font-size: $title-size;
			font-weight: 500;
			color: $main-color;
		}
	}
	.base_info {
		padding: 20rpx;
		padding-left: 50rpx;
		margin-top: 20rpx;
		width: 100%;
		background-color: white;
		display: flex;
		flex-direction: column;
		.info_top {
			display: flex;
			.top_info {
				flex: 7;
				display: flex;
				flex-direction: column;
				position: relative;
				.name {
					color: $main-color;
					font-size: 40rpx;
					margin: 20rpx 0;
				}
				.icon-tubiao09 {
					position: absolute;
					left: 180rpx;
					top: 30rpx;
					font-size: $main-size;
					color: $middle-color;
				}
				.info_box {
					.info {
						color: $main-color;
						font-size: $middle-size;
						&:nth-of-type(1) {
							margin-right: 10rpx;
						}
						&:nth-of-type(2),
						&:nth-of-type(3),
						&:nth-of-type(4) {
							margin: 0 10rpx;
						}
					}
				}
			}
			.top_avatar {
				flex: 3;
				margin-right: 50rpx;
				image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
				}
			}
		}
		.info_bottom {
			display: flex;
			flex-direction: column;
			color: $main-color;
			font-size: $main-size;
			.iconfont {
				font-size: 40rpx;
			}
		}
	}
	.no_info {
		margin-top: 20rpx;
		background-color: white;
		height: 200rpx;
		font-size: $title-size;
		color: $middle-color;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.iconfont {
			font-size: 40rpx;
		}
	}
	.experience {
		margin-top: 20rpx;
		background-color: white;
		.title {
			font-size: $main-size;
			color: $main-color;
			display: block;
			padding: 15rpx 0 15rpx 30rpx;
			border-bottom: 2rpx solid $border-color;
		}
		.edu_list {
			.education_box {
				display: flex;
				margin: 0 30rpx 0 30rpx;
				padding: 20rpx 0;
				border-bottom: 2rpx solid $border-color;
				.pic {
					flex: 2;
					padding-top: 15rpx;
					image {
						width: 80%;
					}
				}
				.info_box {
					flex: 6;
					.school {
						font-size: $main-size;	
						color: $main-color;
						font-weight: 500;
						display: block;
					}
					.education, .major {
						display: inline-block;
						margin-right: 20rpx;
						font-size: $middle-size;
						color: $middle-color
					}
					.during {
						display: block;
						font-size: $middle-size;
						color: $middle-color
					}
				}
				.edu_option {
					flex: 2;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					.iconfont {
						color: $middle-color;
						font-size: $title-size;
					}
					.icon-ashbin {
						font-size: 48rpx;
					}
				}
			}
		}
		
		.add_experience {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 15rpx 0;
			font-size: $main-size;
			color: $main-color;
			.add {
				margin: 0 10rpx;
				padding-bottom: 10rpx;
				font-size: 40rpx;
				font-weight: 500;
				color: $actived-color;
			}
		}
	}
	.project {
		background-color: white;
		margin-top: 20rpx;
		.title {
			font-size: $main-size;
			color: $main-color;
			display: block;
			padding: 15rpx 0 15rpx 30rpx;
			border-bottom: 2rpx solid $border-color;
		}
		.project_box {
			margin: 0 30rpx 0 30rpx;
			padding: 20rpx 0;
			border-bottom: 2rpx solid $border-color;
			display: flex;
			flex-direction: column;
			position: relative;
			.iconfont {
				position: absolute;
				right: 50rpx;
				top: 100rpx;
				color: $middle-color;
				font-size: $title-size;
			}
			.item {
				display: block;
				padding: 0 8rpx;
			}
			.name {
				font-size: $main-size;
				color: $actived-color
			}
			.position, .during {
				font-size: $middle-size;
				color: $middle-color;
			}
			.in_title {
				margin-top: 8rpx;
				font-size: $middle-size;
				color: $main-color;
			}
			.content {
				color: $middle-color;
				font-size: $middle-size;
			}
		}
		.add_project {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 15rpx 0;
			font-size: $main-size;
			color: $main-color;
			.add {
				margin: 0 10rpx;
				padding-bottom: 10rpx;
				font-size: 40rpx;
				font-weight: 500;
				color: $actived-color;
			}
		}
	}
	.submit_box {
		background-color: white;
		.submit {
			margin: 120rpx auto;
			width: 500rpx;
			height: 80rpx;
			color: $border-color;
			background-color: $theme-color;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>