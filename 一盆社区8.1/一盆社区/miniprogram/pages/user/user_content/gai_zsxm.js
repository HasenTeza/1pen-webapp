var APP = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    truename:'',
    xin_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.truename)

  this.setData({
    truename: options.truename
  })


    // console.log(APP)
  },
  mobileInput:function(e){
    // console.log(e.detail.value)
    this.setData({
      xin_name: e.detail.value
    })
    // console.log(this)

 

  },
  btn:function(e){
    console.log(e)
    var data = {
      telephone: APP.globalData.telephone,
      token: APP.globalData.token,
      truename: this.data.xin_name
    }
    // console.log(this.data.xin_name)
    // console.log(data)
    //修改个人信息
    wx.request({
      url: 'https://yp.dxshuju.com/xcx/wxapp/public/index/Members/updateMember',
      header: {
        'content-type': ''
      },
      data: data,
      method: 'POST',
      success: function (res) {
        // console.log(res)
        
        wx:wx.navigateTo({
          url: './user_content',
        })
      }
    })

  },


})