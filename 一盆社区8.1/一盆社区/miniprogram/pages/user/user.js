// pages/user1/user.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    telephone: '',
    dd_state: true,
    vip_status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取拼团订单信息
    wx.request({
      url: app.globalData.requestUrl + '/index/order/getOrderInfoBySingleNumber',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        wx_id: app.globalData.openid,
        bis_id: app.globalData.bis_id
      },
      success: function (res) {
        // console.log(res, '购物车角标')
        console.log(app.globalData.openid, app.globalData.bis_id)
        that.setData({
          jiaobiao1: res.data.result
        })
      }
    })
    //获取普通订单信息
    wx.request({
      url: app.globalData.requestUrl + '/index/order/getOrderNumber',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        wx_id: app.globalData.openid,
        bis_id: app.globalData.bis_id
      },
      success: function (res) {
        // console.log(res, '购物车角标')
        console.log(app.globalData.openid, app.globalData.bis_id)
        that.setData({
          jiaobiao: res.data.result
        })
      }
    })
    //获取会员信息
    wx.request({
      url: app.globalData.requestUrl + '/index/members/getMemberCart',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        mem_id: app.globalData.openid
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          huiyuan:res.data.result
        })
      }
    })
  },

  //会员卡点击
  vip_btn: function () {
    if (this.data.vip_status == false) {
      this.setData({
        vip_status: true
      })
    } else {
      this.setData({
        vip_status: false
      })
    }

  },
  //普通订单
  dd_putong: function () {
    this.setData({
      dd_state: true
    })
  },
  //拼团订单
  dd_pintuan: function () {
    this.setData({
      dd_state: false
    })
  },
  //跳转普通订单页
  get_xiangqing: function (o) {
    // console.log(o.currentTarget.dataset.status)
    wx.navigateTo({
      url: '/pages/orders/myorder?status=' + o.currentTarget.dataset.status,
    })
  },
  //跳转拼团订单页
  get_xiangqing1: function (o) {
    console.log(o.currentTarget.dataset.status)
    wx.navigateTo({
      url: '/pages/orders1/myorder?status=' + o.currentTarget.dataset.status,
    })
  },





  //保洁订单
  bj_dingdan: function () {
    wx.navigateTo({
      url: '/pages/bj_dingdan/bj_dingdan',
    })
  },
  btn_jiaofei: function () {
    wx: wx.navigateTo({
      url: '/pages/jiaofei/jiaofei'
    })
  },
  btn_fenqi: function () {
    console.log('1')
    wx: wx.navigateTo({
      url: '../user/hq_fenqi/hq_fenqi'
    })
  },
  user_content: function () {
    wx: wx.navigateTo({
      url: '../user/user_content/user_content',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //优惠券
  myCoupon: function () {
    wx.navigateTo({
      url: '/pages/user/my_coupon/my_coupon',
    })
  },
  // 地址
  myAddressTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../address/address?from=mine',
      })
    }
  },

  //二维码
  myAcode: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/acode/acode',
      })
    }
  },


  getMyIncome: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      //获取可提现金额和提现中金额
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getMyIncome',
        data: {
          openid: app.globalData.openid
        },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          console.log(res, '我的收入')
          var result = res.data.result
          var ketixian = result.ketixian
          var tixianzhong = result.tixianzhong
          wx.navigateTo({
            url: '/pages/income/income?ketixian=' + ketixian + '&tixianzhong=' + tixianzhong,
          })
        }
      })
    }
  },
  //推荐订单
  getRecOrders: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/rec_orders/order',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    this.setData({
      userInfo: app.globalData.userInfo,
      telephone: app.globalData.telephone
    })
    // console.log(this.data.userInfo)
    // console.log(this.data, APP.globalData)
    if (this.data.telephone) {
      // console.log('1', '用户登录后')
      this.setData({
        img_state1: true,
        img_state: false
      })
    } else {
      this.setData({
        img_state1: false,
        img_state: true
      })
    }


    //获取订单信息
    wx.request({
      url: app.globalData.requestUrl + '/index/order/getOrderInfoBySingleNumber',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        wx_id: app.globalData.openid,
        bis_id: app.globalData.bis_id
      },
      success: function (res) {
        console.log(res, '购物车角标')
        that.setData({
          jiaobiao1: res.data.result
        })
      }
    })
    //获取普通订单信息
    wx.request({
      url: app.globalData.requestUrl + '/index/order/getOrderNumber',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        wx_id: app.globalData.openid,
        bis_id: app.globalData.bis_id
      },
      success: function (res) {
        // console.log(res, '购物车角标')
        console.log(app.globalData.openid, app.globalData.bis_id)
        that.setData({
          jiaobiao: res.data.result
        })
      }
    })
  },
})