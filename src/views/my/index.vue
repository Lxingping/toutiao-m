<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div v-if="user" class="header">
      <div class="user-info">
        <div class="left">
          <van-image class="avatar" :src="userinfo.photo" round fit="cover" />
          <span class="text">{{ userinfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userinfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录 -->

    <!-- 未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn">
        <img
          class="mobile-img"
          src="@/assets/mobile.png"
          alt=""
          @click="$router.push('/login')"
        />
        <span class="text">登录/注册</span>
      </div>
    </div>
    <!-- /未登录 -->

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item icon="photo-o" class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>

      <van-grid-item icon="photo-o" class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <div class="mb-9">
      <van-cell title="消息通知" is-link />
      <van-cell title="小智同学" is-link />
    </div>
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      clickable
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  data() {
    return {
      // 用户信息
      userinfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },

  created() {
    // 如果用户登录了则加载用户数据
    if (this.user) {
      this.loadUserInfo()
    }
  },

  methods: {
    onLogout() {
      console.log('1111')
      this.$dialog
        .confirm({
          message: '确认退出么？'
        })
        .then(() => {
          console.log('确认退出')
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消退出')
        })
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userinfo = data.data
        // console.log(data)
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 185px;
    // background-color: pink;
    background: url('@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 66px;
        height: 66px;
        margin-bottom: 10px;
      }
      .text {
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 375px;
    height: 120px;

    padding: 16px 16px;
    box-sizing: border-box;
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 75px;
        height: 75px;
        margin-right: 7px;
        border: 2px solid #fff;
      }
      .text {
        color: #fff;
        font-size: 15px;
      }
    }
  }
  .data-stats {
    width: 375px;
    // height: 65px;

    display: flex;
    .data-item {
      height: 65px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      .count {
        font-size: 18px;
      }
      .text {
        font-size: 12px;
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 71px;

      i.toutiao {
        font-size: 23px;
      }
      i.toutiao-shoucang {
        color: #eb5253;
      }
      i.toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 14px;
      }
    }
  }

  .mb-9 {
    margin: 5px 0;
  }
  .logout-cell {
    .van-cell__title {
      display: flex;
      justify-content: center;
      color: #d86262;
    }
  }
}
</style>
