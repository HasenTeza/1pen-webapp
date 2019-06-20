var app = getApp()
Page({
  data: {
    acodeUrl: app.globalData.acodeUrl
  },
  onLoad: function (options) {
    // console.log(app.globalData.rec_id)
    var that = this
    var postdata = {
      appid: app.globalData.appid,
      secret: app.globalData.secret,
      openid: app.globalData.openid
    }
    // console.log(postdata)
    wx.request({
      url: app.globalData.requestUrl + '/index/index/getIndWxacode',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        // console.log(that.data.acodeUrl+''+res.data.result)
        that.setData({
          acode_url: res.data.result
        })
      }
    })
  }
})