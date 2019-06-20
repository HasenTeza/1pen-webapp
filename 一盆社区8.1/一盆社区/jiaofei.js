var APP = getApp();
// pages/jiaofei/jiaofei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zonge_assessment: '',
    dangqian_: {},
    lishi_: {},
    telephone: '',
    token: '',
    login_: true, //判断是否登录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("jf",options.jf_msg)
    console.log("wjf", options.wjf_msg)

    if (options.jf_msg == 0 || options.jf_msg == "undefined" || typeof (options.jf_msg) == "undefined"){
      var jf_msg =0;
    }else{
      console.log("js1", typeof (options.jf_msg))
      var jf_msg = JSON.parse(options.jf_msg);
    }
    if (options.wjf_msg == 0 || options.wjf_msg == "undefined" || typeof (options.wjf_msg) == "undefined") {
      var wjf_msg = 0;
    }else{
      console.log("js2", typeof (options.wjf_msg))
      var wjf_msg = JSON.parse(options.wjf_msg);
    }
    var that = this;
    that.setData({    //this.setData的方法用于把传递过来的id转化成小程序模板语言
      jf_msg: jf_msg,  //id是a页面传递过来的名称，b_id是保存在本页面的全局变量   {{b_id}}方法使用
      wjf_msg:wjf_msg
    })

    wx.getStorage({
      key: 'data',
      success: function(res) {
        APP.globalData.telephone = res.data.data.result[0].telephone
        APP.globalData.token = res.data.data.result[0].token
        that.setData({
          telephone: res.data.data.result[0].telephone,
          token: res.data.data.result[0].token
        })
        console.log(APP.globalData.zongeUrl, that.data.telephone, that.data.token)
        //总额
        that.zonge(APP.globalData.zongeUrl, that.data.telephone, that.data.token)
        //当前
        that.dangqian(APP.globalData.dangqianUrl, that.data.telephone, that.data.token)
        //历史
        that.lishi(APP.globalData.lishiUrl, that.data.telephone, that.data.token)

        console.log(APP.globalData.telephone, '登录后')
        if (APP.globalData.telephone) {
          that.setData({
            login_: true,
          })
        }
      },
    })
  },
  jiaofeiPay: function(event) {
    console.log('缴费', event)
    console.log(this.data.telephone, APP.globalData.openid, this.data.zonge_assessment)
    var that = this
    var item = event.currentTarget.dataset.item;
    var community_code = item.community_code;
    var building_code = item.building_code;
    var house_code = item.house_code;
    var project_code = item.project_code;
    var openid = APP.globalData.openid;
    console.log(community_code, building_code, house_code,"project_code", project_code,"openid", openid)
    wx.request({
      url: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/appwxjfpaynew/pay",
      header: {
        'content-type': ''
      },
      data: {
        community_code: community_code,
        building_code: building_code,
        house_code: house_code,
        project_code: project_code,
        openid: openid
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '缴费微信与支付接受')
        that.wxPay(res.data.result)
      }
    })
  },
  wxPay: function(data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.sign,
      paySign: data.package,
      success: function(result) {
        console.log(result)
      },
      fail: function(res) {
        console.log(res, '失败')
      }
    })
  },
  // 缴费信息获取
  zonge: function(url, telephone, token) {
    var that = this
    if (this.data.jf_msg!=0){
      that.setData({
        zonge_assessment: this.data.jf_msg.assessment
      })
    }else{
      that.setData({
        zonge_assessment: 0
      }) 
    }
    
  },
  dangqian: function(url, telephone, token) {
    console.log(this.data.jf_msg,'当前')
    var that = this
    that.setData({
      dangqian_: this.data.jf_msg
    })
   
  },
  lishi: function(url, telephone, token) {
    console.log(this.data.wjf_msg, '历史')
    var that = this;
    that.setData({
      lishi_: this.data.wjf_msg
    })
  },

  //点击跳转
  index_login: function() {
    wx: wx.navigateTo({
      url: '/pages/m_index/login/login',
    })
  },
  //我要分期
  tj_fenqi: function() {
    wx.navigateTo({
      url: '/pages/m_index/tj_fenqi/tj_fenqi',
    })

  },
  //下拉刷新
  onPullDownRefresh: function(options) {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this
    wx.getStorage({
      key: 'data',
      success: function (res) {
        APP.globalData.telephone = res.data.data.result[0].telephone
        APP.globalData.token = res.data.data.result[0].token
        that.setData({
          telephone: res.data.data.result[0].telephone,
          token: res.data.data.result[0].token
        })
        console.log(APP.globalData.zongeUrl, that.data.telephone, that.data.token)
        //总额
        that.zonge(APP.globalData.zongeUrl, that.data.telephone, that.data.token)
        //当前
        that.dangqian(APP.globalData.dangqianUrl, that.data.telephone, that.data.token)
        //历史
        that.lishi(APP.globalData.lishiUrl, that.data.telephone, that.data.token)

        console.log(APP.globalData.telephone, '登录后')
        if (!APP.globalData.telephone) {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          that.setData({
            login_: true,
          })
          console.log(that.data.telephone)
        }

      },
    })

  },
})