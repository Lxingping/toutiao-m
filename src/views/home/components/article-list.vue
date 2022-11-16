<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      :success-text="refrefhSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />

        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      isLoading: false,
      refrefhSuccessText: ''
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getArticle({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now()
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('jfkajkfjijf')
        // }

        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    async onRefresh() {
      try {
        const { data } = await getArticle({
          channel_id: this.channel.id,
          timestamp: Date.now()
        })

        const { results } = data.data
        this.list.splice(...results)
        this.isLoading = false
        this.refrefhSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isLoading = false
        this.refrefhSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 80vh;
  overflow-y: auto;
}
</style>
