//share.js
//获取应用实例
var app = getApp()
Page({
    data: {
      imgUrl: app.globalData.imgUrl
    },
    onLoad: function (options) {
      console.log(options)
      var that = this
      var order_id = options.order_id
      that.setData({
        order_id: order_id
      })
      //获取订单信息
      that.getOrderInfo(order_id)
    },
    //获取订单信息
    getOrderInfo: function (order_id){
        var that = this
        wx.request({
          url: app.globalData.requestUrl + '/index/order/getOrderInfoByShare',
          data: { order_id: order_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            console.log(res,'拼团分享')
            var order_res = res.data.order_res
            var mem_res = res.data.mem_res
            var is_enough = res.data.is_enough
            var mem_id = res.data.mem_id
            that.setData({
              order_res: order_res,
              mem_res: mem_res,
              is_enough: is_enough,
              mem_id: mem_id
            })

            // // 查看是否授权
            wx: wx.getSetting({
              success: function (res) {
                console.log(order_id)
                // console.log(res.authSetting['scope.userInfo'])
                if (res.authSetting['scope.userInfo']) {
                  // console.log('授权了')
                } else {
                  wx.reLaunch({
                    url: '/pages/first/first?order_id=' + order_id + '&url=/pages/share/share',
                  })
                  // console.log('没有授权给个弹框让他授权')
                }

              }
            })

          }
        })
    },
  //检测是否授权
  bindGetUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log('授权了', e.detail.userInfo.nickName, app.globalData.openid)
      //为后台微信名和openid
      wx.request({
        url: app.globalData.requestUrl + '/index/members/getnickname',
        data: {
          nickname: e.detail.userInfo.nickName,
          mem_id: app.globalData.openid,
          wx_img: e.detail.userInfo.avatarUrl
        },
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          console.log(res)
        }
      })

      wx: wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      that.setData({
        sq_state: false
      })
      // if (getCurrentPages().length != 0) {
      //   //刷新当前页面的数据
      //   getCurrentPages()[getCurrentPages().length - 1].onLoad()
      // }
    } else {
      //用户按了拒绝按钮
      console.log('没授权')
      that.setData({
        sq_state: true
      })
    }
  },



    qianggou : function(){
      var that = this
      var order_id = that.data.order_id
      var mem_id = that.data.mem_id
      if (mem_id == app.globalData.openid){
        wx.showToast({
          title: '不能拼自己的团哦!',
          image: '/pics/icons/tanhao.png',
          duration: 1200,
          mask: true
        })
      }else{
        //获取商品id
        wx.request({
          url: app.globalData.requestUrl + '/index/order/getProIdByShare',
          data: { order_id: order_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            console.log(res)
            var pro_id = res.data.pro_id
            var group_num = res.data.group_num
            var mem_id = res.data.mem_id
            wx.redirectTo({
              url: '/pages/group_pro_detail/pro_detail?pro_id=' + pro_id + '&group_num=' + group_num,
            })
          }
        })
      }
    }
})    
