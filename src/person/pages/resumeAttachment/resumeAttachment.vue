<template>
  <view class="container">
    <view class="none content_box" v-if="attachmentList.length === 0">暂无附件简历</view>
    <view v-else v-for="(item,index) in attachmentList" :key="index" class="watch content_box">
      <text class="info">
        <text class="iconfont icon-folder"></text>
        {{item.name}}
      </text>
      <view class="btn">
        <text class="view" @click="viewResume" :data-index="index">预览</text>
        <text class="delete" @click="deleteResume" :data-index="index">删除</text>
      </view>
    </view>
    <view class="add_resume" @click="chooseFile" v-if="!attachmentList.length">
      <text>上传简历</text>
    </view>
    <view class="add_resume" @click="upLoadFile" v-else>
      <text>确认上传</text>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      // 存放简历信息
      attachmentList: [],
      posData: {}
    };
  },
  onLoad(options){
    this.posData = options.posObj
  },
  onShow() {
    //取缓存的数据
    let data = uni.getStorageSync("attachment");
    console.log(data);
    if (data) {
      this.attachmentList = data;
    } else {
      this.attachmentList = [];
    }
  },
  methods: {
    ...mapActions([
      'setCommit'
    ]),
    //上传文件
    upLoadFile() {
      console.log("upload");
      this.setCommit(posData)
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
    },
    // 选择简历文件
    chooseFile(e) {
      //保存this对象
      const app = this;
      wx.chooseMessageFile({
        count: 1,
        type: "file",
        success(res) {
          let temp = {
            name: res.tempFiles[0].name,
            path: res.tempFiles[0].path,
          };
          app.attachmentList.push(temp);
          uni.setStorageSync("attachment", app.attachmentList);
        },
      });
    },

    // 查看简历
    viewResume(event) {
      let index = event.currentTarget.dataset.index;
      wx.downloadFile({
        url: this.attachmentList[index].path,
        success: (res) => {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            success: (res) => {
              console.log("打开文档成功");
              // console.log(res)
            },
          });
        },
      });
    },
    // 删除简历
    deleteResume(event) {
      let index = event.currentTarget.dataset.index;
      this.attachmentList.splice(index, 1);
      uni.setStorageSync("attachment", this.attachmentList);
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  margin: 70rpx;
  .content_box {
    height: 300rpx;
    width: 80vw;
    border: dashed 2rpx $circle-border-color;
    border-radius: 15rpx;
    font-size: $title-size;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .info {
      font-size: $main-size;
      color: $main-color;
      text-align: center;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .icon-folder {
        font-size: 42rpx;
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      .view,
      .delete {
        margin: 0 50rpx;
        height: 60rpx;
        width: 200rpx;
        text-align: center;
      }
      .view {
        color: $actived-color;
      }
      .delete {
        color: $salary-color;
      }
    }
  }
  .add_resume {
    width: 280rpx;
    height: 80rpx;
    border-radius: 15rpx;
    background-color: $actived-color;
    margin: 150rpx auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $main-size;
    color: white;
  }
  .none {
    text-align: center;
    color: $middle-color;
    font-size: $middle-size;
  }
}
</style>