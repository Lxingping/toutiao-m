import dayjs from 'dayjs'
import Vue from 'vue'

// 加载中文语言包
import 'dayjs/locale/zh-cn' // ES 2015

import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 注册为全局使用
dayjs.locale('zh-cn') // use loaded locale globally

// 定义一个全局过滤器，然后就可以在任何组件的模板中使用了
// 其实过滤器就相当于一个全局可用的方法 ( 仅供模板使用 )
// 参数1：过滤器名称
// 参数2: 过滤器函数
// 使用方式: {{ 表达式 | 过滤器名称 }}
// 管道符前面的表达式的结果会作为参数传递到过滤器函数中
// 过滤器的返回值会渲染使用到过滤器的模板位置
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})

// console.log(dayjs().format('YYYY-MM-DD'))
