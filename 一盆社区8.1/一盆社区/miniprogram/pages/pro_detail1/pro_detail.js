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
    pl_index: '0',
    sq_state:false
  },

  onLoad: function(options) {
    console.log(options)
    var that = this

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    var pro_id = options.pro_id;

    that.hq_pinglun(options.pro_id);
    // console.log(pro_id)
    //获取商品详情
    wx.request({
      url: app.globalData.requestUrl + '/index/index/getProDetailOneDimensional',
      data: {
        pro_id: pro_id
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function(res) {
        console.log(res)
        console.log('pro_id', res.data.result.pro_id)
        that.setData({
          pro_detail_info: res.data.result,
          pro_id: res.data.result.pro_id
        })
        // // 查看是否授权
        wx: wx.getSetting({
          success: function (res) {
            console.log(that.data.pro_id)
            // console.log(res.authSetting['scope.userInfo'])
            if (res.authSetting['scope.userInfo']) {
              // console.log('授权了')
            }else{
              wx.reLaunch({
                url: '/pages/first/first?pro_id=' + that.data.pro_id +'&url=/pages/pro_detail1/pro_detail' ,
              })
              // console.log('没有授权给个弹框让他授权')
            }
            
          }
        })
        
      }
    })
    //获取拼团信息
    that.getGroupInfo(pro_id)
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


  //详情
  sp_xiangqing: function () {
    this.setData({
      mu: true
    })
  },
  //评论
  sp_pinglun: function () {
    this.setData({
      mu: false
    })
  },

  //获取评论
  hq_pinglun: function (pro_id) {
    console.log(pro_id, this.data.pl_index)
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
        console.log(res,'拼团评论')
        that.setData({
          pl_list: res.data.result
        })
      }
    })
  },

    //nav
  nav: function (o) {
    console.log(o.target.dataset.index)
    //记录点击的那个
   

    var index = o.target.dataset.index;
    this.setData({
      pl_index: index
    })
    // console.log(this.data.pro_id)

    this.hq_pinglun(this.data.pro_id);
  },

  //跳转到商城
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
    wx.switchTab({
      url: '/pages/shoppingCart/shoppingcart',
      success: function(e) {
        var page = getCurrentPages().pop();
        page.onLoad();
      }
    })
  },
  //单独购买
  buySingle: function(e) {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      var pro_id = that.data.pro_id
      var from = 'single'

      that.setData({
        from: from
      })
      var postdata = {
        pro_id: pro_id,
        from: from
      }
      //获取商品配置信息
      wx.request({
        url: app.globalData.requestUrl + '/index/product/getProConfigInfoOneDimensionalByGroup',
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function(res) {
          that.setData({
            conname: '',
            selectconid: '',
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
  //一键开团
  buyByGroup: function(e) {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      var pro_id = that.data.pro_id
      var from = 'group'
      that.setData({
        from: from
      })
      var postdata = {
        pro_id: pro_id,
        from: from
      }

      //获取商品配置信息
      wx.request({
        url: app.globalData.requestUrl + '/index/product/getProConfigInfoOneDimensionalByGroup',
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function(res) {
          that.setData({
            conname: '',
            selectconid: '',
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
    var pro_id = e.target.dataset.proid
    var from = that.data.from
    var postdata = {
      pro_id: pro_id,
      from: from
    }
    wx.request({
      url: app.globalData.requestUrl + '/index/product/getConByIdOneDimensionalByGroup',
      data: postdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function(res) {
        var result = res.data.result
        that.setData({
          conname: conname,
          cur_price: result.price,
          selectconid: pro_id
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
    var pro_id = that.data.pro_detail_info.pro_id
    var pintuan_count = that.data.pro_detail_info.pintuan_count
    var group_num = that.data.group_num


    if (!selectconid || selectconid == '' || selectconid == 0) {
      wx.showToast({
        title: '请选择规格',
        image: '/pics/icons/tanhao.png',
        duration: 1200,
        mask: true
      })
    } else {
      if (from == 'join_group') {
        var postdata = {
          bis_id: bis_id,
          pro_id: selectconid,
          count: finalcount,
          wx_id: openid
        }
        wx.request({
          url: app.globalData.requestUrl + '/index/shoppingcart/addGroupProIntoCart',
          data: postdata,
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            var cart_id = res.data.result
            console.log('拼团下单', res)
            console.log('拼团下单传参', cart_id, pro_id, pintuan_count, group_num,from)
            wx.navigateTo({
              url: '/pages/confirm_order1/confirm_order?cart_id=' + cart_id + '&pro_id=' + pro_id + '&from=' + from + '&pintuan_count=' + pintuan_count + '&group_num=' + group_num,
            })
          }
        })
      } else {
        var postdata = {
          bis_id: bis_id,
          pro_id: selectconid,
          count: finalcount,
          wx_id: openid
        }
        console.log(postdata,'from不存在')
        wx.request({
          url: app.globalData.requestUrl + '/index/shoppingcart/addGroupProIntoCart',
          data: postdata,
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            console.log('拼团下单', res)
            var cart_id = res.data.result
            console.log('拼团下单传参', cart_id, pro_id, pintuan_count,from)
            wx.navigateTo({
              url: '/pages/confirm_order1/confirm_order?cart_id=' + cart_id + '&pro_id=' + pro_id + '&from=' + from + '&pintuan_count=' + pintuan_count,
            })
          }
        })
      }
    }
  },




  //分享
  onShareAppMessage: function() {
    return {
      title: this.data.pro_detail_info.p_name,
      path: '/pages/pro_detail1/pro_detail?pro_id=' + this.data.pro_detail_info.pro_id
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
  },
  //获取拼团信息
  getGroupInfo: function(pro_id) {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/product/getGroupInfoByProId',
      data: {
        pro_id: pro_id
        // pro_id: 330
      },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function(res) {
        console.log(res,'拼团详情信息')
        that.setData({
          group_info: res.data.result,
          count: res.data.count
        })
      }
    })
  },
  //参团
  join_group: function(e) {
    var that = this
    var mem_id = e.currentTarget.dataset.memid
    var group_num = e.currentTarget.dataset.groupnum

    that.setData({
      mem_id: mem_id,
      group_num: group_num,
      from: 'join_group'
    })

    that.buyByJoinGroup()
  },
  //一键参团
  buyByJoinGroup: function(e) {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      if (that.data.mem_id == app.globalData.openid) {
        wx.showToast({
          title: '不能拼自己的团哦!',
          image: '/pics/icons/tanhao.png',
          duration: 1200,
          mask: true
        })
      } else {
        var pro_id = that.data.pro_id
        var from = 'join_group'
        that.setData({
          from: from
        })
        var postdata = {
          pro_id: pro_id,
          from: from
        }
        //获取商品配置信息
        wx.request({
          url: app.globalData.requestUrl + '/index/product/getProConfigInfoOneDimensionalByGroup',
          data: postdata,
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function(res) {
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

    }
  },
})