// pages/bj_dingdan/bj_dingdan.js
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
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/serorder/getOrders',
      data: {
        mem_id: app.globalData.openid,
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success:function(res){
        console.log(res)
        that.setData({
          bj_dingdan:res.data.result
        })
      }
    })
   
    // this.getSelectedCartInfo()
  },
  //获取选中的购物车信息
  // getSelectedCartInfo: function (openid, bis_id) {
  //   var that = this
  //   wx.request({
  //     url: app.globalData.requestUrl + '/index/shoppingcart/getSelectedCartInfo',
  //     data: {
  //       openid: openid,
  //       bis_id: bis_id
  //     },
  //     method: 'post',
  //     header: {
  //       'content-type': ''
  //     },
  //     success: function (res) {
  //       console.log(res, '购物车信息')
  //       if (res.data.result.address_info.length == 0) {
  //         that.setData({
  //           showAddress: false
  //         })
  //       } else {
  //         that.setData({
  //           showAddress: true
  //         })
  //       }
  //       var pro_amount = res.data.result.pro_amount
  //       // console.log(pro_amount)
  //       //获取该店铺的运费模式
  //       wx.request({
  //         url: app.globalData.requestUrl + '/index/index/getTransportType',
  //         data: {
  //           bis_id: bis_id
  //         },
  //         method: 'post',
  //         header: {
  //           'content-type': ''
  //         },
  //         success: function (result) {
  //           var transportType = result.data.result.transport_type
  //           if (transportType == 1) {
  //             if (res.data.result.transportInfo.length == 0) {
  //               wx.showToast({
  //                 title: '店家未设置快递方式',
  //                 image: '/pics/icons/tanhao.png',
  //                 duration: 1500,
  //                 mask: true,
  //                 success: function () {
  //                   that.setData({
  //                     transportType: transportType,
  //                     showFreightView: false,
  //                     total_amount: '0.00',
  //                     transport_fee: '0.00',
  //                     selected_transport_type: '',
  //                     buttonUsable: true
  //                   })
  //                 }
  //               })
  //             } else {
  //               var first_heavy = res.data.result.transportInfo[0]['first_heavy']
  //               var continue_heavy = res.data.result.transportInfo[0]['continue_heavy']
  //               var continue_stage = res.data.result.transportInfo[0]['continue_stage']
  //               var total_weight = res.data.result.total_weight
  //               var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
  //               var total_amount = (parseFloat(res.data.result.pro_amount) + parseFloat(transport_fee)).toFixed(2)
  //               that.setData({
  //                 transportType: transportType,
  //                 showFreightView: true,
  //                 total_amount: total_amount,
  //                 transport_fee: transport_fee,
  //                 selected_transport_type: res.data.result.transportInfo[0]['mode_id'],
  //                 buttonUsable: false
  //               })
  //             }
  //           } else {
  //             var pro_amount = res.data.result.pro_amount
  //             var ykj_price = result.data.result.ykj_price
  //             var total_amount = parseFloat(pro_amount) + parseFloat(ykj_price)
  //             that.setData({
  //               transportType: transportType,
  //               showFreightView: false,
  //               transport_fee: ykj_price,
  //               total_amount: total_amount,
  //               selected_transport_type: '',
  //               buttonUsable: false
  //             })
  //           }
  //         }
  //       })

  //       that.setData({
  //         cart_info: res.data.result,
  //         transport_type: res.data.result.transportType,
  //         transport_info: res.data.result.transportInfo,
  //         pro_amount: pro_amount,
  //         total_weight: res.data.result.total_weight
  //       })
  //     }
  //   })
  // }

})