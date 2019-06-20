// order.js
var app = getApp()
Page({
  data: {
      
  },
  onLoad : function(){
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/order/getRecOrders',
      data: { openid: app.globalData.openid },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.setData({
          rec_info: res.data.result,
          count: res.data.count ? res.data.count : 0
        })
      }
    })
  }
 
})