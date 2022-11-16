<template>
  <div class="update-name">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="field-ward">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="10"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast('昵称不能为空')
        }
        await updateUserProfile({
          name: localName
        })
        // 更新视图
        this.$emit('input', localName)

        // 点击返回
        this.$emit('close')

        // 成功提示
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-name {
  .field-ward {
    padding: 10px;
  }
}
</style>
