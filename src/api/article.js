// 文章请求

import request from '@/utils/request'

// 获取文章列表
export const getArticle = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}

// 获取文章详情
export const getArticleById = (articleId) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const addCollect = (target) => {
  return {
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  }
}

// 取消收藏文章
export const deteleCollect = (target) => {
  return {
    method: 'DETELE',
    url: `/v1_0/article/collections/${target}`
  }
}

// 点赞文章
export const addLick = (target) => {
  return {
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  }
}

// 取消点赞文章
export const deteleLick = (target) => {
  return {
    method: 'DETELE',
    url: `/v1_0/article/likings/${target}`
  }
}