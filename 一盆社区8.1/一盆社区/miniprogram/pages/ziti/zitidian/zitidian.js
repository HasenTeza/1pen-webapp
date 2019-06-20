// pages/ziti/zitidian/zitidian.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('11')
    var that = this
    wx.request({
      url: app.globalData.requestUrl+'/index/mention/getAllMentionInfo',
      data: { 
        bis_id: app.globalData.bis_id
       },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res.data.result)
        that.setData({
          zitidian: res.data.result
        })
      }
    })
  },
  btn:function(e){
    console.log(e.currentTarget.dataset.menction_id)
    wx.request({
      url: app.globalData.requestUrl + '/index/mention/getMentionCheck',
      data: {
        menction_id: e.currentTarget.dataset.menction_id,
        openid:app.globalData.openid
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res.data.result[0])
        var pages = getCurrentPages(); // 获取页面栈
        var currPage = pages[pages.length - 1]; // 当前页面
        var prevPage = pages[pages.length - 2]; // 上一个页面
        prevPage.setData({
          ziti_content: res.data.result[0]
        })
        wx.navigateBack({
          delta: 1
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