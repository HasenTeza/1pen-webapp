// pages/hq_fenqi/hq_fenqi.js
var APP = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{},
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data1 = {
      nickName: APP.globalData.userInfo.nickName,
      avatarUrl: APP.globalData.userInfo.avatarUrl
    }
    this.setData({
      user:data1
    })
    var that = this;
    var data = {
      telephone: APP.globalData.telephone,
      token: APP.globalData.token
    }
    // console.log(data)
    wx.request({
      url: 'https://yp.dxshuju.com/xcx/wxapp/public/index/Stage/stageInfo',
      header: {
        'content-type': ''
      },
      data: data,
      method: 'POST',
      success: function (res) {
        that.setData({
          list: res.data.result[0]
        })
      }
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