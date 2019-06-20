var app = getApp()
var imageUtil = require('../../utils/util.js');
Page({
  data: {
    animationData: "",
    showModalStatus: false,
    windowHeight: '',
    con_b_name: '',
    imgUrl: app.globalData.imgUrl,
    from: 'cart',
    imageSizeInfo: {},
    mu: true,
    pl_index:'0',
  },
  
  onLoad: function(option) {
    console.log(option.pro_id)
    var that = this
    that.setData({
      pro_idmu: option.pro_id
    })

    that.hq_pinglun(that.data.pro_idmu);

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    // console.log(option.pro_id)
    var pro_id1 = option.pro_id;
    //获取商品信息
    wx.request({
      url: app.globalData.requestUrl + '/index/index/getProDetail',
      data: {
        pro_id: pro_id1
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function(res) {
        console.log(res,'普通商品详情')
        that.setData({
          pro_detail_info: res.data.result
        })
        // 查看是否授权
        wx: wx.getSetting({
          success: function (res) {
            console.log(res.authSetting['scope.userInfo'])
            if (res.authSetting['scope.userInfo']) {
              // console.log('授权了')
            } else {

              wx.reLaunch({
                url: '/pages/first/first?pro_id=' + option.pro_id + '&url=/pages/pro_detail/pro_detail',
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

    } else {
      //用户按了拒绝按钮
      console.log('没授权')
      that.setData({
        sq_state: true
      })
    }
  },
  //详情
  sp_xiangqing:function(){
    this.setData({
      mu:true
    })
  },
  //评论
  sp_pinglun:function(){
    this.setData({
      mu: false
    })
  },
  //获取评论
  hq_pinglun: function (pro_id){
    // console.log(pro_id, this.data.pl_index)
    var that = this;
    wx.request({
      url: 'https://cool.1peng.com.cn/xcx/wxapp/public/index/Evaluate/selectEvaluate',
      data: {
        pro_id: pro_id,
        type: that.data.pl_index
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res,'商品评论')
        that.setData({
          pl_list:res.data.result
        })
      }
    })
  },
  //nav
  nav:function(o){
    // console.log(o.target.dataset.index)
    //记录点击的那个
    var index = o.target.dataset.index;
    this.setData({
      pl_index:index
    })
    // console.log(this.data.pl_index)

    this.hq_pinglun(this.data.pro_idmu);
  },

  //跳转到首页
  goStore: function(event) {
    wx.switchTab({
      url: '/pages/m_index/index',
      success: function(e) {
        var page = getCurrentPages().pop();
        page.onLoad();
      }
    })
  },
  //跳转到购物车
  goShoppingCart: function(event) {
    var that = this
    // console.log(app.globalData.userInfo)
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.switchTab({
        url: '/pages/shoppingCart/shoppingcart',
        success: function(e) {
          var page = getCurrentPages().pop();
          // console.log(that, page)
          page.onLoad();
        }
      })
    }

  },
  //选择规格（加入购物车）
  selectGuige: function(e) {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      var pro_id2 = e.target.dataset.proid
      // console.log(pro_id2)
      var from = e.target.dataset.from
      that.setData({
        from: from
      })
      //获取商品配置信息
      wx.request({
        url: app.globalData.requestUrl + '/index/product/getProConfigInfoOneDimensional',
        data: {
          pro_id: pro_id2
        },
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function(res) {
          console.log(res, '1111')
          that.setData({
            conname: '',
            cur_price: '',
            pro_config_info: res.data.result,
            select_count: 1
          })
          //获取购物车信息给购物车navbar加上角标
          wx.request({
            url: app.globalData.requestUrl + '/index/shoppingcart/getShoppingCartInfo',
            data: {
              bis_id: app.globalData.bis_id,
              wx_id: app.globalData.openid
            },
            header: {
              'content-type': ''
            },
            method: 'post',
            success: function (res) {
              // console.log(res, '获取购物车信息')
              var num = String(res.data.result.length)
              // console.log(num)
              wx.setTabBarBadge({
                index: 2,
                text: num
              })

            }
          })
          
        }
      })
      //显示遮罩层
      that.showModel()
    }

  },
  //选择规格（立即购买）
  buyNow: function(e) {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      var pro_id3 = e.target.dataset.proid
      var from = e.target.dataset.from
      that.setData({
        from: from
      })
      //获取商品配置信息
      wx.request({
        url: app.globalData.requestUrl + '/index/product/getProConfigInfoOneDimensional',
        data: {
          pro_id: pro_id3
        },
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function(res) {
          console.log(res,'确定购买')
          that.setData({
            conname: '',
            cur_price: '',
            pro_config_info: res.data.result,
            select_count: 1
          })
        }
      })
      //显示遮罩层
      that.showModel()
    }

  },
  // 显示遮罩层
  showModel: function() {
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateY(that.data.windowHeight).step()
    that.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(that.data.windowHeight * 0.23).step()
      that.setData({
        animationData: animation.export()
      })
    }.bind(that), 200)
  },
  // 隐藏遮罩层
  hideModal: function() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(this.data.windowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(this.data.windowHeight * 0.23).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //选择数量减1
  subtraction: function(e) {
    var that = this
    var select_count = parseInt(e.target.dataset.selectcount)
    if (select_count == 1) {
      that.setData({
        select_count: 1
      })
    } else {
      var new_count = select_count - 1
      that.setData({
        select_count: new_count
      })
    }
  },
  //选择数量加1
  plus: function(e) {
    var that = this
    var select_count = parseInt(e.target.dataset.selectcount)
    var new_count = select_count + 1
    that.setData({
      select_count: new_count
    })
  },
  //选择规格按钮
  select_config1_tap: function(e) {
    var that = this
    var conname = e.target.dataset.conname
    var pro_id4 = e.target.dataset.proid
    wx.request({
      url: app.globalData.requestUrl + '/index/product/getConByIdOneDimensional',
      data: {
        pro_id: pro_id4
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function(res) {
        var result = res.data.result
        that.setData({
          conname: conname,
          cur_price: result.price,
          selectconid: pro_id4
        })
      }
    })
  },

  //确认按钮
  xiadan: function(e) {
    var that = this
    var from = that.data.from
    var bis_id = app.globalData.bis_id
    var finalcount = e.target.dataset.finalcount
    var openid = app.globalData.openid
    var selectconid = e.target.dataset.selectconid
    if (!selectconid || selectconid == '' || selectconid == 0) {
      wx.showToast({
        title: '请选择规格',
        image: '/pics/icons/tanhao.png',
        duration: 2000,
        mask: true
      })
    } else {
      var postdata = {
        bis_id: bis_id,
        pro_id: selectconid,
        count: finalcount,
        wx_id: openid
      }
      wx.request({
        url: app.globalData.requestUrl + '/index/shoppingcart/addProIntoCart',
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function(res) {
          if (res.data.statuscode == 1) {
            if (from == 'cart') {
              wx.showToast({
                title: '加入购物车成功',
                icon: 'success',
                duration: 2000,
                success: function(result) {
                  // 隐藏遮罩层  
                  that.hideModal();
                }
              })
            } else if (from == 'buy') {
              wx.switchTab({
                url: '/pages/shoppingCart/shoppingcart?',
                success: function(e) {
                  var page = getCurrentPages().pop();
                  page.onLoad();
                }
              })
            }
          }
        }
      })
    }
  },
  //分享
  onShareAppMessage: function() {
    return {
      title: this.data.pro_detail_info.p_name,
      path: '/pages/pro_detail/pro_detail?pro_id=' + this.data.pro_detail_info.pro_id
    }
  },
  imageLoad: function(e) {
    var that = this
    var imageSize = imageUtil.imageUtil(e)

    var imageSizeInfo = that.data.imageSizeInfo;
    imageSizeInfo[e.target.dataset.index] = {
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    }
    that.setData({
      imageSizeInfo: imageSizeInfo
    })
  }
})