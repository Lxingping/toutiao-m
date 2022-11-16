<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        round
        type="info"
        size="small"
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
          通过 animated 属性可以开启切换标签内容时的转场动画。
          通过 swipeable 属性可以开启滑动切换标签页。
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
      </van-tab>

      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        @updata-active="onupdataActive"
        :my-channels="channels"
        :active="active"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.loadChannels()
  },
  methods: {
    async loadChannels() {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []

        if (this.user) {
          // 已登录，请求用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          // 未登录，判断是否有本地的频道列表数据
          if (localChannels) {
            // 有，拿来用
            channels = localChannels
          } else {
            // 没有，请求默认频道列表
            const { data } = await getUserChannels()
            this.channels = data.data.channels
          }
        }

        this.channels = channels
      } catch (err) {
        this.$toast('数据加载失败，请重试')
      }
    },
    onupdataActive(index, isChannelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-bottom: 50px;
  padding-top: 87px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 278px;
    height: 32px;
    font-size: 14px;
    background-color: #5babfd;
    border: none;
    .van-icon {
      font-size: 16px;
    }
  }

  // 导航栏
  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 41px;
      position: fixed;
      top: 46px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 100px;
      font-size: 15px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .van-tabs__line {
      bottom: 5px;
      width: 16px;
      height: 3px;
      background-color: #3296fa;
    }
  }

  // 汉堡标签
  .placeholder {
    flex-shrink: 0;
    width: 33px;
    height: 41px;
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 33px;
    height: 41px;
    background-color: #fff;
    opacity: 0.9;
    &::before {
      content: '';
      width: 1px;
      height: 100%;
      position: absolute;
      left: 0;
      background-image: url('@/assets/gradient-gray-line.png');
      background-size: contain;
    }
  }
}
</style>
