var app = getApp()
Page({

  data: {

  },

  onLoad: function (options) {
    //将字符串转换成对象
    var bean = JSON.parse(options.model);
    if (options.model == null) {
      wx.showToast({
        title: '数据为空',
      })
      return;
    }
    this.setData({
      model: bean
    })
    // console.log(options.orderid)

    var that = this
    var postdata = {
      order_id: options.orderid
    }
    that.getOrderInfo(postdata)

  },
  //获取订单信息
  getOrderInfo: function (postdata) {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/order/getOrderDetailInfo',
      data: postdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res)
        if (res.data.statuscode == 1) {
          that.setData({
            order_info: res.data.result
          })
          // console.log(res.data.result)
        } else {
          that.setData({
            order_info: []
          })
        }

        //自提信息
        that.setData({
          ziti_content: res.data.result.mention_id
        })
      }
    })
  }

})