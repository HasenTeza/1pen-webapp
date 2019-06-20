// pages/user_content/user_content.js

var APP = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    telephone: '',
    truename: '',
    tempFilePaths: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.setData({
      avatarUrl: APP.globalData.userInfo.avatarUrl,
      nickName: APP.globalData.userInfo.nickName,
      telephone: APP.globalData.telephone
    })
    var data = {
      telephone: APP.globalData.telephone,
      token: APP.globalData.token
    }
    //获取个人信息
    wx.request({
      url: 'https://yp.dxshuju.com/xcx/wxapp/public/index/Members/selectMember',
      header: {
        'content-type': ''
      },
      data: data,
      method: 'POST',
      success: function(res) {
        // console.log(res.data.res[0].truename)
        that.setData({
          truename: res.data.res[0].truename
        })
      }
    })


  },
  gai_zsxm:function(){
    var truename = this.data.truename;
    wx:wx.navigateTo({
      url: './gai_zsxm?truename='+[truename],
    })
  },



  huan_touxiang: function() {
    console.log('1')
    // var _this = this;
    // wx.chooseImage({
    //   count: 1, // 默认9
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function(res) {
    //     console.log(res)
    //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //     _this.setData({
    //       tempFilePaths: res.tempFilePaths
    //     })
    //   }
    // })
    // //修改请求
    // wx.request({
    //   url: 'https://yp.dxshuju.com/xcx/wxapp/public/index/Members/updateMember',
    //   header: {
    //     'content-type': ''
    //   },
    //   data: data,
    //   method: 'POST',
    //   success: function(res) {
    //     console.log(res)

    //   }
    // })

  }




})