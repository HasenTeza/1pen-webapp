//shoppingcart.js
//获取应用实例
var app = getApp()
Page({
  data: ({
    selected: false,
    total_price: '0.00',
    selectedAllStatus: 0,
    imgUrl: app.globalData.imgUrl
  }),
  onLoad: function (o) {
    wx.removeTabBarBadge({
      index: 2
    })
  },
  onShow: function (e) {
    wx.removeTabBarBadge({
      index: 2
    })
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      var bis_id = app.globalData.bis_id
      that.getCartInfo(bis_id, app.globalData.openid)
      that.getCartTotalPrice(bis_id, app.globalData.openid)
    }
  },
  //单选框
  bindCheckbox: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    var cartid = parseInt(e.currentTarget.dataset.cartid);
    var status = e.currentTarget.dataset.status;
    var selected = '';
    if (status == 1) {
      selected = 0
    } else {
      selected = 1
    }

    //更改购物车选中状态
    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/updateSelectedStatus',
      data: { cart_id: cartid, selected_status: selected },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.getCartInfo(bis_id, app.globalData.openid)
        that.getCartTotalPrice(bis_id, app.globalData.openid)
      }
    })

  },
  //全选、取消全选
  bindSelectAll: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    var selectedAllStatus = that.data.selectedAllStatus;
    var selected = '';
    if (selectedAllStatus == 1) {
      selected = 0
    } else {
      selected = 1
    }
    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/updateAllSelectedStatus',
      data: { bis_id: bis_id, wx_id: app.globalData.openid, selected_status: selected },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.getCartInfo(bis_id, app.globalData.openid)
        that.getCartTotalPrice(bis_id, app.globalData.openid)
        that.setData({
          selectedAllStatus: selected
        })
      }
    })
  },
  //获取购物车信息
  getCartInfo: function (bis_id, wx_id) {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/getShoppingCartInfo',
      data: { bis_id: bis_id, wx_id: wx_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        console.log(res, '获取购物车信息')
        // console.log(res.data.result.length)
        if (res.data.statuscode == 1) {
          that.setData({
            cart_info: res.data.result
          })
        } else {
          that.setData({
            cart_info: []
          })
        }
      }
    })
  },
  //获取购物车内选中产品总价格
  getCartTotalPrice: function (bis_id, wx_id) {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/getSelectedTotalPrice',
      data: { bis_id: bis_id, wx_id: wx_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        // console.log(res,res.data.result.price1,'获取总价格')
        var total_price = ''
        if (res.data.result.price == 0) {
          total_price = '0.00'
        } else (
          total_price = (res.data.result.price1).toFixed(2)
        )
        that.setData({
          total_price: total_price
        })
      }
    })
  },
  //购物车对应商品数量减1
  subtap: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    var cartid = parseInt(e.target.dataset.cartid)
    var status = e.target.dataset.status
    var selectedcount = parseInt(e.target.dataset.selectedcount)
    var postdata = {}
    if (selectedcount != 1) {
      if (status == 0) {
        postdata = {
          cart_id: cartid,
          selected_status: 1,
          selectedcount: selectedcount,
          type: 'sub'
        }
      } else {
        postdata = {
          cart_id: cartid,
          selectedcount: selectedcount,
          type: 'sub'
        }
      }

      wx.request({
        url: app.globalData.requestUrl + '/index/shoppingcart/updateSelectedCount',
        data: postdata,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          that.getCartInfo(bis_id, app.globalData.openid)
          that.getCartTotalPrice(bis_id, app.globalData.openid)
        }
      })
    }
  },
  //购物车对应商品数量加1
  plustap: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    var cartid = parseInt(e.target.dataset.cartid)
    var status = e.target.dataset.status
    var selectedcount = parseInt(e.target.dataset.selectedcount)
    var postdata = {}
    if (status == 0) {
      postdata = {
        cart_id: cartid,
        selected_status: 1,
        selectedcount: selectedcount,
        type: 'plus'
      }
    } else {
      postdata = {
        cart_id: cartid,
        selectedcount: selectedcount,
        type: 'plus'
      }
    }

    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/updateSelectedCount',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.getCartInfo(bis_id, app.globalData.openid)
        that.getCartTotalPrice(bis_id, app.globalData.openid)
      }
    })
  },
  //去结算按钮
  jiesuan: function () {
    var that = this
    var openid = app.globalData.openid
    //验证是否存在选中的购物车商品
    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/checkSelectedPro',
      data: { openid: openid },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {

        console.log(res, '去结算')
        if (res.data.result > 0) {
          wx.navigateTo({
            url: '../confirm_order/confirm_order?openid=' + openid,
          })
        } else {
          wx.showToast({
            title: '请选择商品',
            image: '/pics/icons/tanhao.png',
            duration: 2000,
            mask: true
          })
        }
      }
    })

  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/getShoppingCartInfo',
      data: { bis_id: bis_id, wx_id: app.globalData.openid },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        if (res.data.statuscode == 1) {
          that.setData({
            cart_info: res.data.result
          })
        } else {
          that.setData({
            cart_info: []
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
    that.getCartTotalPrice(bis_id, app.globalData.openid)
  },
  //上拉加载更多（待开发）
  onReachBottom: function () {
  },
  //删除指定id购物车
  deleteCart: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    var cartid = parseInt(e.currentTarget.dataset.cartid)
    //执行操作
    wx.request({
      url: app.globalData.requestUrl + '/index/shoppingcart/deleteCartById',
      data: { cart_id: cartid },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        if (res.data.statuscode == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000,
            success: function (result) {
              that.getCartInfo(bis_id, app.globalData.openid)
              that.getCartTotalPrice(bis_id, app.globalData.openid)
            }
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'fail',
            duration: 2000,
            success: function (result) {
              that.getCartInfo(bis_id, app.globalData.openid)
              that.getCartTotalPrice(bis_id, app.globalData.openid)
            }
          })
        }
      }
    })
  }

})
