//app.js
App({

  onLaunch: function() {



    //获取购物车信息
    var that = this
    
    



    //缓存中获取数据
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var loginStatus = true;
        that.getUserInfo(loginStatus)

      },
      fail: function(res) {
        //获取用户信息
        var loginStatus = true;
        that.getUserInfo(loginStatus)
      }
    })
  },
  getUserInfo: function(loginStatus) {
    var that = this
    if (!loginStatus) {
      wx.openSetting({
        success: function(data) {
          if (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                success: function(data) {
                  that.globalData.userInfo = data.userInfo
                  //将userInfo存入缓存
                  wx.setStorage({
                    key: "userInfo",
                    data: data.userInfo
                  })
                  that.getOpenId()
                }
              });
            }
          }
        }
      });
    } else {
      wx.login({
        success: function(res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: false,
              success: function(data) {
                //将userInfo存入缓存
                wx.setStorage({
                  key: "userInfo",
                  data: data.userInfo
                })
                that.globalData.userInfo = data.userInfo
                that.getOpenId()
              },
              fail: function() {
                loginStatus = false;

              }
            });
          }
        }
      })
    }
  },



  //获取openid的方法，将openid放入缓存中
  getOpenId: function() {
    var that = this
    var userInfo = that.globalData.userInfo
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
      success: function(res) {
        var postdata = {
          appid: that.globalData.appid,
          secret: that.globalData.secret,
          code: res.code,
          bis_id: that.globalData.bis_id,
          avatarUrl: userInfo.avatarUrl,
          city: userInfo.city,
          country: userInfo.country,
          gender: userInfo.gender,
          nickName: userInfo.nickName,
          province: userInfo.province
        }
        wx.request({

          url: that.globalData.requestUrl + '/index/index/getOpenIdNew',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'POST',
          success: function(res) {
            // console.log(res, 'openid1111111')
            that.globalData.openid = res.data.openid
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
              url: that.globalData.requestUrl + '/index/shoppingcart/getShoppingCartInfo',
              data: {
                bis_id: that.globalData.bis_id,
                wx_id: that.globalData.openid
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

      }
    })
  },

  //定义的支付数据库
  globalData: {
    bis_id: '3', //店铺id
    userInfo: null,
    telephone: '',
    token: '',
    appid: "wx7b8c42d3d5bcbc2d",
    // secret: "bdb27db5d5b4041d700d441791d4479e",
    secret: "4296759d4a316ff4eb6d952eaf3afd9b",
    
    openid: '',
    acode: '',
    rec_id: '', //推荐人id
  //   imgUrl: "http://cp.1peng.com.cn/",
  //   acodeUrl: "https://cool.1peng.com.cn/xcx/wxapp/public/",
  //   requestUrl: "https://cool.1peng.com.cn/xcx/wxapp/public",
  //   payUrl: "https://cool.1peng.com.cn/xcx/wxapp/public/index/paygroup/pay", //拼团商品支付
  //   payUrl1: "https://cool.1peng.com.cn/xcx/wxapp/public/index/Pay/pay", //普通商品支付
  //   // payUrl1: "https://benguo.dxshuju.com/xcx/wxapp/public/index/Pay2/pay",             //普通商品支付  测试
  //   zongeUrl: "https://cool.1peng.com.cn/xcx/wxapp/public/index/Currentpay/sumPay",
  //   dangqianUrl: "https://cool.1peng.com.cn/xcx/wxapp/public/index/Currentpay/selectInfo",
  //   lishiUrl: "https://cool.1peng.com.cn/xcx/wxapp/public/index/Historypay/historyInfo"
  // }




  imgUrl: "http://www.1psq.cn/",
  acodeUrl: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/",
  requestUrl: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/",
  payUrl: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/paygroup2/pay", 
  //拼团商品支付http://cp.1peng.com.cn/u
  payUrl1: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/Pay2/pay", //普通商品支付
  payUrl3: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/Pay2/pay", //接龙商品支付
  // payUrl1: "https://benguo.dxshuju.com/xcx/wxapp/public/index/Pay2/pay",             //普通商品支付  测试
  zongeUrl: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/Currentpay/sumPay",
  dangqianUrl: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/Currentpay/selectInfo",
  lishiUrl: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/Historypay/historyInfo"
}
})