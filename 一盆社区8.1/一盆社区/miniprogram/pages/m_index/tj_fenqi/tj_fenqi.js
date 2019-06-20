// pages/tj_fenqi/tj_fenqi.js
var APP = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(APP)
  },
  mobileInput: function (e) {
    // console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },
  btn: function () {
    // console.log(this.data.phone)
    if(!this.data.phone){
      return;
    }
    var data = {
      telephone: APP.globalData.telephone,
      token: APP.globalData.token,
      phone: this.data.phone
    }
    console.log(data)
    wx.request({
      url: 'https://yp.dxshuju.com/xcx/wxapp/public/index/Stage/addStage',
      header: {
        'content-type': ''
      },
      data:data,
      method: 'POST',
      success: function (res) {
       console.log(res)
        wx.showModal({
          title: '提交成功',
          content: '等待认证，成功即可使用分期',
          success: function (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              wx.switchTab({
                url: '../m_index/index', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
              })
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })  
      }
    })
  }
})