<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败,请稍后重试"
    @load="onLoad"
  >
    <comment-item v-for="(item, index) in list" :key="index" :comment="item" />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from '../comment-item'

export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset,
          limit: this.limit
        })
        // console.log(data)
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        this.$emit('onload-success', data.data)
        // 3. 将 loading 设置为 false
        this.loading = false
        // 4. 判断是否还有数据
        if (results.length) {
          // 有就更新下一页
          this.offset = data.data.last_id
        } else {
          // 没有就讲 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
