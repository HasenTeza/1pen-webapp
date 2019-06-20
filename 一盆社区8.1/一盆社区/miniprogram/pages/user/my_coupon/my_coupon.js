// pages/user/my_coupon/my_coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    console.log(app.globalData.bis_id,app.globalData.requestUrl + '/index/coupon/getCoupon',app.globalData.openid)
    wx.request({
      url: app.globalData.requestUrl+'/index/coupon/getCoupon',
      header:{
        'content-type': ''
      },
      method:'POST',
      data:{
        bis_id: app.globalData.bis_id,
        mem_id: app.globalData.openid
      },
      success:function(res){
        console.log(res.data.result, res.data.result.weiyou)
        that.setData({
          quanbu:res.data.result.quan,
          shixiao: res.data.result.weishi,
          weishi: res.data.result.weiyou,
          yishiyong: res.data.result.yishiyong,
          shiyongzhong: res.data.result.shiyongzhong
        })
      }
    })
  },
  status:function(e){
    // console.log(e.currentTarget.dataset.status)
    this.setData({
      status: e.currentTarget.dataset.status
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})