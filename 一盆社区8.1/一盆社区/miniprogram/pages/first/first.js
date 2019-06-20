var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sq_xs: true, //根据用户是否授权改变状态
    sq_zhengti: true, //用户授权成功整个哲罩层消失
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options !== ''){
      this.setData({
        url: options.url,
        pro_id: options.pro_id,
        order_id:options.order_id
      })
    }
    console.log(this.data.url,this.data.pro_id)
    // console.log(APP.globalData.logs_sq)
    // var that = this
    // // 查看是否授权
    // wx: wx.getSetting({
    //   success: function (res) {
    //     // console.log(res.authSetting['scope.userInfo'])
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.switchTab({
    //         url: '../m_index/index', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
    //       })
    //     }

    //   }
    // })

  },
  aa: function () {
    this.setData({
      'sq_xs': false
    })
  },
  bindGetUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      // console.log('授权了', e.detail.userInfo.nickName, APP.globalData.openid, e.detail.userInfo.avatarUrl)
      //为后台微信名和openid
      // wx.request({
      //   url: app.globalData.requestUrl+'/index/members/getnickname',
      //   data: {
      //     nickname: e.detail.userInfo.nickName,
      //     mem_id: app.globalData.openid,
      //     wx_img: e.detail.userInfo.avatarUrl
      //   },
      //   method: 'post',
      //   header: {
      //     'content-type': ''
      //   },
      //   success: function (res) {
      //     console.log(res)
      //   }
      // })

      // console.log(this.data.url, this.data.pro_id)

      wx: wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      app.globalData.userInfo = e.detail.userInfo
      console.log(e.detail.userInfo, '授权后更新app.js的userInfo')

      if (this.data.url && this.data.pro_id){
        wx.reLaunch({
          url: this.data.url + '?pro_id=' + this.data.pro_id,
        })
      } else if (this.data.order_id){
        wx.reLaunch({
          url: this.data.url + '?order_id=' + this.data.order_id,
        })
      }else{
        wx.switchTab({
          url: '../m_index/index', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        })
      }
      

    } else {
      //用户按了拒绝按钮
      console.log('没授权')
      this.setData({
        'sq_xs': true
      })
    }
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