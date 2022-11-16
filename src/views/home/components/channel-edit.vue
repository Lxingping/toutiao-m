<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        @click="isEdit = !isEdit"
        type="danger"
        plain
        round
        size="mini"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- v-bind: calss 语法 
            一个对象，对象中的 key 表示要作用的 css 类名
                      对象中的 value 要计算出布尔值
                        true，则作用该类名
                        false，不作用该类名
      -->
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        v-for="(channel, item) in recommendChannels"
        :key="item"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  data() {
    return {
      allchannel: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行

    recommendChannels() {
      // 数组的 filter 方法：遍历数组，把复合条件的元素存储到新数组中
      return this.allchannel.filter((channel) => {
        // const channel = []

        // 数组的 find 方法：遍历数组，把复合条件的第一个元素返回
        return !this.myChannels.find((myChannels) => {
          return myChannels.id === channel.id
        })

        // return channels
      })
    }

    // recommendChannels() {
    //   const channels = []
    //   this.allchannel.forEach((channel) => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find((myChannels) => {
    //       return myChannels.id === channel.id
    //     })

    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })

    //   return channels
    // }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allchannel = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录, 把数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重新保存')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 1. 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 2.编辑状态：删除频道
        // splice( 参数1：要删除的元素的开始索引（包括），参数2：删除的个数，如果不指定，则从参数1一直删除)
        this.myChannels.splice(index, 1)

        // 3. 如果删除的激活频道之前的频道，则更新激活的频道项
        if (index <= this.active) {
          this.$emit('updata-active', this.active - 1, true)
        }

        // 4. 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态：跳转频道
        this.$emit('updata-active', index, false)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上

          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 42px 0;
  .van-cell__value {
    line-height: 0;
  }
  .title-text {
    font-size: 16px;
    color: #333;
  }
  .edit-btn {
    width: 53px;
    height: 24px;
    font-size: 13px;
    color: #f96767;
    border: 1px solid #f96767;
  }
  /deep/.grid-item {
    width: 83px;
    height: 43px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
    }
    .van-grid-item__text,
    .text {
      font-size: 14px;
      color: #222;
      margin-top: 0;
    }
    .active {
      color: red;
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
  /deep/.recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
    }
    .van-icon {
      font-size: 12px;
      margin-right: 3px;
    }
  }
  /deep/ .my-grid {
    .van-icon-clear {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #cacaca;
      z-index: 2;
    }
  }
}
</style>
