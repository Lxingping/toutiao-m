<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <!--     
      1、 给 van-field 组件配置 rules 验证规则
      2、 当表单提交的时候会自动触发表单验证
          如果验证通过，会触发 submit 事件
          如果演示失败，不会触发 submit
     -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>

      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time 属性表示倒计时总时长，单位为毫秒。 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="6000 * 10"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            @click="onSendSms"
            round
            size="small"
            type="default"
            class="send-sms-btn"
            native-type="button"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit() {
      // 1. 获取表单数据
      const user = this.user
      // 2.表单验证
      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景
        duration: 0 // 持续事件，默认是 2000，如果为 0 则持续展示
      })
      // 3. 提交表单请求登录
      try {
        const { data } = await login(user)
        // console.log('登录成功', res)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')

        // 登录成功，跳转页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机或验证码输入错误，请重新输入')
          this.$toast.fail('手机或验证码输入错误')
        } else {
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
      // 4. 根据请求相应结果出来后续操作
    },
    async onSendSms() {
      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证成功')
      } catch (err) {
        return console.log('验证失败', err)
      }

      console.log('111')
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        if (err.response.status === 429) {
          this.isCountDownShow = false
          this.$toast('发送次数过于频繁')
        } else {
          this.$toast('发送失败')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 19px;
  }
  .send-sms-btn {
    width: 78px;
    height: 23px;
    // line-height: 23px;
    background-color: #ededed;
    font-size: 11px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 27px 14px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
