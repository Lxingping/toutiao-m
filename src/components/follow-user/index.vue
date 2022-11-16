<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FoloowUser',
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'updata-is_folollwed' // 默认是 input
  },
  data() {
    return {
      loading: false
    }
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onFollow() {
      this.Loading = true
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 未关注，添加关注
          await addFollow(this.userId)
          // this.article.is_followed = true
        }

        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('updata-is_folollwed', !this.isFollowed)
      } catch (err) {
        console.log(err)
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '自己不能关注自己！'
        }
        this.$toast(message)
      }
      this.Loading = false
    }
  }
}
</script>

<style></style>
