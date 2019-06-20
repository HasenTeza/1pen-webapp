var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImgs: {},
    telephone: '',
    token: '',
    zonge_assessment: '',
    dangqian_: {},
    lishi_: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.setNavigationBarTitle({
    //   title: '趣味表情'
    // })

    var that = this

    


    this.setData({
      options: options
    })
    // 获取userinfo
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            withCredentials: false,
            success: function (data) {
              //将userInfo存入缓存
              wx.setStorage({
                key: "userInfo",
                data: data.userInfo
              })
              app.globalData.userInfo = data.userInfo
              that.getOpenid(options)
            },
            fail: function () {
            }
          });
        }
      }
    })
    //缓存
   
    var that = this
    // console.log(APP.globalData.openid)
    // that.getOpenid(options)
    var bis_id = app.globalData.bis_id

    //获取公告信息
    wx.request({
      url: app.globalData.requestUrl + '/index/announcement/getHomePreManyAnnouncement',
      data: {
        bis_id: app.globalData.bis_id
      },
      header: {
        'content-type': ''
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          gonggao: res.data.result
        })
      }
    }),

      //推荐商品列表
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getRecommendProInfo',
        data: {
          bis_id: bis_id
        },
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            recommend_info: res.data.result
          })
        }
      }),

      //新品列表
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getNewProInfo',
        data: {
          bis_id: bis_id
        },
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            new_pro_info: res.data.result
          })
        }
      }),


      //拼团商品
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getRecProByGroup',
        header: {
          'content-type': ''
        },
        data: {
          bis_id: bis_id
        },
        method: 'POST',
        success: function (res) {
          // console.log(res)
          that.setData({
            pintuan_data: res.data.result
          })
        }
      }),


      // banner
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getBannerInfo',
        header: {
          'content-type': ''
        },
        data: {
          bis_id: bis_id
        },
        method: 'GET',
        success: function (res) {
          // console.log(res,'banner')
          that.setData({
            bannerImgs: res.data.result.shouye,
            p_banner: res.data.result.tuijian[0].image
          })
        }
      })
  },
  //banner详情
  image_btn: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.rout_xcx,
    })
    // console.log(e.currentTarget.dataset.rout_xcx)
  },
  //获取拼团详情
  getProDetail_pin: function (event) {
    var pro_id = event.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/pro_detail1/pro_detail?pro_id=' + pro_id,
    })
  },
  //获取详情
  getProDetail: function (event) {
    var pro_id = event.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/pro_detail/pro_detail?pro_id=' + pro_id,
    })
  },


  // 获取openid
  getOpenid: function (options) {
    // console.log(app.globalData.userInfo)

    var that = this
    var userInfo = app.globalData.userInfo
    var userinfo = {
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      country: userInfo.country,
      gender: userInfo.gender,
      nickName: userInfo.nickName,
      province: userInfo.province
    }
    // console.log(userInfo)
    //调用登录接口
    wx.login({
      success: function (res) {
        var postdata = {
          appid: app.globalData.appid,
          secret: app.globalData.secret,
          code: res.code,
          bis_id: app.globalData.bis_id,
          avatarUrl: userInfo.avatarUrl,
          city: userInfo.city,
          country: userInfo.country,
          gender: userInfo.gender,
          nickName: userInfo.nickName,
          province: userInfo.province
        }
        wx.request({

          url: app.globalData.requestUrl + '/index/index/getOpenIdNew',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'POST',
          success: function (res) {
            // console.log(res, 'openid1111111')
            app.globalData.openid = res.data.openid
            // console.log('res',res)
            if (!res.data.openid) {
              that.getOpenId()
            } else {
              //将openid存入缓存
              wx.setStorage({
                key: "openid",
                data: res.data.openid
              })
            }
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
                console.log(res, '获取购物车信息')
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

      }
    })
    // console.log(app.globalData.userInfo)
    // var that = this
    // //获取openid
    // wx.login({
    //   success: function(res) {
    //     var postdata = {
    //       appid: app.globalData.appid,
    //       secret: app.globalData.secret,
    //       code: res.code
    //     }

    //     wx.request({
    //       url: app.globalData.requestUrl + '/index/index/getOpenIdOnly',
    //       data: postdata,
    //       header: {
    //         'content-type': ''
    //       },
    //       method: 'post',
    //       success: function(res) {
    //         console.log(res.data.openid)
    //         // console.log(app.globalData.openid,'1')
    //         var openid = res.data.openid
    //         app.globalData.openid = res.data.openid
    //         that.checkRecStatus(options, openid) 
    //         // console.log(app.globalData.openid,'2')
    //       }
    //     })
    //   }
    // })
  },
  //判断是否被推荐
  checkRecStatus: function (options, openid) {
    var that = this
    var bis_id = app.globalData.bis_id
    var options = this.data.options
    //判断是否获取到推荐人参数
    if (!options.id || options.id == 'undefined') {
      var postdata = {
        openid: openid,
        bis_id: bis_id
      }
    } else {
      var userid = options.id
      var postdata = {
        rec_id: userid,
        openid: openid,
        bis_id: bis_id
      }
    }
    //检验本用户是否被别人推荐，如果已被推荐，不操作；无被推荐，把推荐用户id更新到会员表中
    wx.request({
      url: app.globalData.requestUrl + '/index/members/checkRecStatus',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        // console.log(res)
        app.globalData.rec_id = res.data.result
      }
    })
  },



  baoxiu: function () {
    wx: wx.navigateTo({
      url: '/pages/m_index/index_nav/index_nav1',
    })
  },
  baojie: function () {
    wx: wx.navigateTo({
      url: '/pages/m_index/baojie/index_nav3',
    })
  },
  gonggao: function () {
    wx: wx.navigateTo({
      url: '/pages/m_index/index_nav/index_nav2',
    })
  },
  jiaofei: function () {
    wx: wx.navigateTo({
      url: '/pages/jiaofei/jiaofei_place/jiaofei_place',
    })
  },
  pintuan: function () {
    wx.navigateTo({
      url: '/pages/m_index/pintuan/pintuan',
    })
  },
  tuijian: function () {
    wx.navigateTo({
      url: '/pages/m_index/tuijian/tuijian',
    })
  },
  zitiye: function () {
    wx.navigateTo({
      url: '/pages/ziti/zitidian/zitidian',
    })
  },
  youhuiquan: function () {
    wx.navigateTo({
      url: '/pages/m_index/youhuiquan/youhuiquan',
    })
  },

  //跳转搜索
  search: function () {
    wx.navigateTo({
      url: '/pages/m_index/search/search',
    })
  },

  //跳转公告详情
  ToGongGao: function (event) {
    var pro_id = event.currentTarget.dataset.proid
    wx.navigateTo({
      url: '/pages/gonggao_detail/gonggao_detail?pro_id=' + pro_id,
    })

  },

  /**
      * 生命周期函数--监听页面初次渲染完成
      */
  onReady: function () {
    if (!app.globalData.userInfo || app.globalData.userInfo == '') {
      

    }
    wx: wx.getSetting({
      success: function (res) {
        // console.log(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          // console.log('授权了')
        } else {

          wx.reLaunch({
            url: '/pages/first/first',
          })
          // console.log('没有授权给个弹框让他授权')
        }

      }
    })
  },

  //下拉刷新
  onPullDownRefresh: function (options) {

    wx.showNavigationBarLoading() //在标题栏中显示加载

    //缓存
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        app.globalData.userInfo = res.data
      },
    })

    //将userInfo从缓存中拿出
    var that = this
    // console.log(APP.globalData.openid)
    // that.getOpenid(options)
    that.checkRecStatus(options, app.globalData.openid)
    var bis_id = app.globalData.bis_id



    //获取公告信息
    wx.request({
      url: app.globalData.requestUrl + '/index/announcement/getHomePreManyAnnouncement',
      data: {
        bis_id: app.globalData.bis_id
      },
      header: {
        'content-type': ''
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          gonggao: res.data.result
        })
      }
    }),

      //推荐商品列表
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getRecommendProInfo',
        data: {
          bis_id: bis_id
        },
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            recommend_info: res.data.result
          })
        }
      }),

      //新品列表
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getNewProInfo',
        data: {
          bis_id: bis_id
        },
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            new_pro_info: res.data.result
          })
        }
      }),


      //拼团商品
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getRecProByGroup',
        header: {
          'content-type': ''
        },
        data: {
          bis_id: bis_id
        },
        method: 'POST',
        success: function (res) {
          // console.log(res)
          that.setData({
            pintuan_data: res.data.result
          })
        }
      }),


      // banner
      wx.request({
        url: app.globalData.requestUrl + '/index/index/getBannerInfo',
        header: {
          'content-type': ''
        },
        data: {
          bis_id: bis_id
        },
        method: 'GET',
        success: function (res) {
          that.setData({
            bannerImgs: res.data.result.shouye,
            p_banner: res.data.result.tuijian[0].image
          })
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      })
  },
  // 转发分享
  onShareAppMessage: function () {
    return {
      title: '社区团购，上百社区，火爆团购中！',
      path: '/pages/m_index/index'
    }
  },
})