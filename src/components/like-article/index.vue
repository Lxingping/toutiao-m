<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: value === 1 }"
    @click="onLickArticle"
    :loading="loading"
  />
</template>

<script>
import { addLick, deteleLick } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onLickArticle() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 取消点赞
          await addLick(this.articleId)
        } else {
          // 添加点赞
          await deteleLick(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)

        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  color: #ffa600;
}
</style>
