// order_template.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl
  },
  onLoad:function(){
    console.log(app.globalData.imgUrl)
  }
})