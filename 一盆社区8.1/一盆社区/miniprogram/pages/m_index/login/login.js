// pages/login/login.js
var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telephone: '',
    index: 60,
    yzm: true,
    yzm1: false,
    newcode: '',
    tiaozhuan: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  input_t: function(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  input_yzm: function(e) {
    this.setData({
      newcode: e.detail.value
    })
  },
  //获取验证码
  huoqu_yzm: function() {

    var that = this;
    console.log(that.data.telephone)
    wx.request({
      url: app.globalData.requestUrl +'/index/members/faMember',
      header: {
        'content-type': ''
      },
      data: {
        telephone: that.data.telephone
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.result[0].newcode)
        that.setData({
          yzm: false,
          yzm1: true
        })
        that.countdown(that);
        if (!res.data.result[0].newcode) {
          console.log('请输入正确手机号')
        }
      }
    })

  },
  //验证码倒计时
  countdown: function(that) {
    var index = that.data.index;
    if (index == 0) {
      that.setData({
        yzm: true,
        yzm1: false
      });
      return;
    }
    var time = setTimeout(function() {
      that.setData({
        index: index - 1,
      });

      that.countdown(that);
    }, 1000)
  },
  //登录
  login: function() {


    console.log(this.data.tiaozhuan)
    var that = this;
    wx.request({
      url: app.globalData.requestUrl +'/index/members/login',
      header: {
        'content-type': ''
      },
      data: {
        telephone: that.data.telephone,
        newcode: that.data.newcode,
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.result[0].bis_id)
        if (res.data.result[0].bis_id) {
          console.log('点击的时候可以判断数据是否拿到')
          that.setData({
            tiaozhuan: true
          })
          wx.navigateTo({
            url: '/pages/jiaofei/jiaofei',
            success: function (res) {
              console.log(res, '跳转成功')
            },
            fail: function (res) { },
            complete: function (res) { },
          })
          
        
        }

        //用缓存存储用户信息
         wx:wx.setStorage({
           key: 'data',
           data: res,
           success: function(res) {},
           fail: function(res) {},
           complete: function(res) {},
         })
      }
    })


  }

})