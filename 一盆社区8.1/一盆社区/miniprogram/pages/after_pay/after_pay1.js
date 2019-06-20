var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    var that = this
    var order_id = options.order_id
    var status = options.status
    var from = options.from
    if (from == 'join_group') {
      var group_num = options.group_num
      that.setData({
        group_num: group_num
      })
    }
    console.log(options, options.order_id, '拼团支付成功失败页初始')
    that.getOrderInfo(order_id)
    that.setData({
      order_id: order_id,
      pay_status: status,
      from: from
    })
  },
  onUnload: function () {//如果页面被卸载时被执行
    this.gotoHomePage();
  },
  gotoHomePage: function () {//自定义页面跳转方法
    let that = this;
    //------------------
    if (that.data.clickFlag) {
      return;
    } else {
      that.setData({ clickFlag: true });
    }
    //------------------
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面


    wx.navigateBack({
      delta: 1
    })
  },
  //生成微信预订单
  makePreOrder: function (order_id) {
    var that = this
    var pdata = {
      order_id: order_id,
      body: '商品',
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.payUrl,
      data: pdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var preData = res.data.result
        //调起微信支付
        that.wxPay(preData, pdata.order_id)
      }
    })
  },
  //调起微信支付
  wxPay: function (preData, order_id) {
    var that = this
    wx.requestPayment({
      timeStamp: (preData.timeStamp).toString(),
      nonceStr: preData.nonceStr,
      package: preData.package,
      signType: preData.signType,
      paySign: preData.sign,
      success: function (result) {
        //更改订单状态
        wx.request({
          url: app.globalData.requestUrl + '/index/order/updateOrderStatusBySingle',
          data: { order_id: order_id, from: that.data.from },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            //参团模式
            if (that.data.from == 'join_group') {
              wx.request({
                url: app.globalData.requestUrl + '/index/order/updateOrderByJoinGroup',
                data: { group_num: that.data.group_num },
                method: 'post',
                header: {
                  'content-type': ''
                },
                success: function (res) {
                }
              })
            }
          }
        })
        if (!app.globalData.rec_id || app.globalData.rec_id == '') {
          wx.navigateTo({
            url: '/pages/orders/myorder'
          })
        } else {
          //设置主订单表推荐人及佣金信息
          wx.request({
            url: app.globalData.requestUrl + '/index/order/setMainRecInfo',
            data: { order_id: order_id, rec_id: app.globalData.rec_id },
            method: 'post',
            header: {
              'content-type': ''
            },
            success: function (res) {
              wx.navigateTo({
                url: '/pages/orders/myorder'
              })
            }
          })
        }
      }
    })
  },
  //获取订单号和总价格
  getOrderInfo: function (order_id) {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/order/getOrderInfoByOrderIdBySingle',
      data: { order_id: order_id },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res, '获取订单号和总价格，拼团')
        that.setData({
          'order_no': res.data.result.order_no,
          'total_amount': res.data.result.total_amount,
        })
      }
    })
  },
  //跳转到订单列表
  preview_orders: function () {
    wx.navigateTo({
      url: '../orders1/myorder',
    })
  },
  //重新支付
  repay: function () {
    var that = this
    var order_id = that.data.order_id
    var from = that.data.from
    if (from == 'join_group') {
      //检验当前是否已成团
      wx.request({
        url: app.globalData.requestUrl + '/index/order/checkGroupStatusByOrderId',
        data: { order_id: order_id },
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          console.log(res, '拼团点击重新拉起支付')
          if (res.data.statuscode == 0) {
            //未成团
            that.makePreOrder(order_id)
          } else {
            wx.showToast({
              title: '手慢了，被别人抢先拼成了！',
              image: '/pics/icons/tanhao.png',
              duration: 1200,
              mask: true
            })
          }
        }
      })
    } else {
      that.makePreOrder(order_id)
    }
  }
})
