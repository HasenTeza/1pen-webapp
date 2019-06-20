// pages/yhq_zhifu/yhq_zhifu.js
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
    // console.log(options.column)
    var column = JSON.parse(options.column)
    console.log(column)
    this.setData({
      column:column
    })
  },
  yhq_xuanze:function(e){
    console.log(e.currentTarget.dataset.miaoshu)
    console.log(app.globalData.openid, e.currentTarget.dataset.column_id)
    wx.request({
      url: app.globalData.requestUrl + '/index/coupon/chooseColumn',
      data: {
        member:app.globalData.openid,
        column_id: e.currentTarget.dataset.column_id
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res.data.result)
        if (res.data.result === 1){
          var pages = getCurrentPages(); // 获取页面栈
          var currPage = pages[pages.length - 1]; // 当前页面
          var prevPage = pages[pages.length - 2]; // 上一个页面

          prevPage.setData({
            miaoshu: e.currentTarget.dataset.miaoshu,
            money: e.currentTarget.dataset.money 
          })
          wx.navigateBack({
            delta: 1
          })
        }
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