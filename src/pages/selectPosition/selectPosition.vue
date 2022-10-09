<template>
    <view class="container">
        <text class="title">选择您的职位类型</text>
		<uni-list class="pos_list">
			<uni-list-item v-for="(item, index) in posList" :key="index">
				<view class="pos_item" @click="open" :data-index="index">
					<text class="pos_item">{{item}}</text>
					<text class="iconfont icon-arrow-right tail"></text>
				</view>
			</uni-list-item>
		</uni-list>
        
        <pop-up ref="popup" type="bottom">
           <view class="pop_main">
                <view class="pop_left">
                    <scroll-view scroll-y class="left_list">
                        <uni-list>
                            <uni-list-item v-for="(item, index) in leftList" :key="index">
                                <view 
                                class="left_item"
                                :class="{'actived':currentIndex === index}"
                                @click="selectLeft"
                                :data-index="index">
                                {{item.value}}
                                </view>
                            </uni-list-item>
                        </uni-list>
                    </scroll-view>
                </view>
                <view class="pop_right">
                    <scroll-view scroll-y class="right_list">
                        <uni-list>
                            <uni-list-item v-for="(item, index) in rightList" :key="index">
                                <view 
                                class="right_item"
                                @click="selectRight"
                                :data-index="index">
                                {{item}}
                                </view>
                            </uni-list-item>
                        </uni-list>
                    </scroll-view>
                </view>
           </view>
        </pop-up>
    </view>
    
</template>

<script>
import posSelect from './posSelect'
import PopUp from '../../components/uni-popup/uni-popup'
import { mapGetters, mapActions } from 'vuex'
const data = posSelect.data
export default {
    data() {
        return {
            leftList:[],
            rightList: [],
            currentIndex: 0,
            posList: [],
            selectMode: ''
        }
    },
    onLoad(option) {
        this.selectMode = option.mode
        console.log(this.selectMode)
        this._getPosSelect()
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    components: {
        PopUp
    },
    methods: {
        ...mapActions([
            'setHopeData',
            'setSearchHistory'
        ]),
        _getPosSelect() {
            data.map((item) => {
                this.posList.push(item.value)
            })
        },
        open(e) {
            this.$refs.popup.open()
            const index = e.currentTarget.dataset.index
            this.leftList = []
            data[index].children.map((item) => {
                this.leftList.push(item)
            })
            this.rightList = this.leftList[0].children
        },
        selectLeft(e) {
            const index = e.currentTarget.dataset.index
            this.currentIndex = index
            this.rightList = []
            this.leftList[index].children.map((item) => {
                 this.rightList.push(item)
            })
        },
        selectRight(e) {
            const index = e.currentTarget.dataset.index
            if(this.selectMode === 'hope') {
                this.setHopeData({ type: 'hopePos', data: `${this.leftList[this.currentIndex].value}-${this.rightList[index]}` }) 
            }else if(this.selectMode === 'search') {
                const length = this.searchHistory.length
                if(!length) {
                    this.setSearchHistory({ value: this.rightList[index], id: 0})
                }else {
                    this.setSearchHistory({ value: this.rightList[index], id: length})
                }
                uni.$emit('request', this.rightList[index])

            }
            uni.navigateBack({
                delta: 1
            });
            
        }

    }
}
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        margin: 0 30rpx;
        .title {
            color: $main-color;
            font-size: 48rpx;
            font-weight: 500;
            margin: 50rpx 0;
        }
        .pos_list {
            width: 100%;
            .pos_item {
                display: flex;
                align-items: center;
                position: relative;
                height: 100rpx;
                font-size: $title-size;
                color: $main-color;
                border-bottom: 2rpx solid $border-color;
                .tail {
                    position: absolute;
                    right: 0;
                }
            }
        }
        .pop_main {
            height: 70vh;
            width: 100%;
            background: white;
            display: flex;
            .pop_left, .pop_right {
                flex: 6;
                .left_list, .right_list {
                    height: 70vh;
                    .left_item, .right_item  {
                        height: 100rpx;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: $main-color;
                        font-size: $main-size;
                    }
                }
            }
            .pop_left {
                flex: 4;
                background: $back-color;
                .left_list {
                    uni-list {
                        uni-list-item {
                            .actived {
                                color: $actived-color;
                            }
                        }
                    }
                }
                
            }
        }
    }
</style>