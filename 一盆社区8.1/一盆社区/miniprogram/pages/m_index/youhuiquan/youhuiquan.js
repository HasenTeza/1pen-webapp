// pages/m_index/youhuiquan/youhuiquan.js
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
  onLoad: function(options) {
    this.youhuiquan()
  },
  //获取优惠券
  youhuiquan: function() {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/couponcolumn/getAllCouponColumn',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        bis_id: app.globalData.bis_id,
        member: app.globalData.openid
      },
      success: function(res) {
        console.log(res)
        that.setData({
          youhuiquan: res.data.result
        })
      }
    })
  },
  //点击领取
  cou_id: function(e) {
    // console.log(e.currentTarget.dataset.cou_id)
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/couponcolumn/addCouponColumn',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        bis_id: app.globalData.bis_id,
        member: app.globalData.openid,
        column_id: e.currentTarget.dataset.cou_id
      },
      success: function(res) {
        console.log(res)
        
        if (res.data.statuscode === 1) {
          that.youhuiquan()
          wx.showToast({
            title: '已领取',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        } else if (res.data.statuscode === 0) {
          wx.showToast({
            title: '该代金券已被领取',
            // icon: 'loading',
            duration: 1000,
            mask: true
          })
        } else {
          wx.showToast({
            title: '该代金券不存在',
            icon: 'loading',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})