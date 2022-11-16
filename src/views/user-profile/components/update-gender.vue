<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value
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
        const localGender = this.localGender
        await updateUserProfile({
          name: localGender
        })
        // 更新视图
        this.$emit('input', localGender)

        // 点击返回
        this.$emit('close')

        // 成功提示
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败!')
      }
    },

    onPickerChange(picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style lang="less" scoped></style>
