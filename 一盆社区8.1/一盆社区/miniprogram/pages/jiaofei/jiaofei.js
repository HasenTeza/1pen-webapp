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
    that.dangqian()
    //历史
    that.lishi()
  
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
 
  wxPay: function (data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.sign,
      success: function (result) {
        console.log(result)
      },
      fail: function (res) {
        console.log(res, '失败')
      }
    })
  },
 
  dangqian: function() {
    console.log(this.data.jf_msg,'当前')
    var that = this
    console.log("jf_msg.type", typeof (this.data.jf_msg))
    that.setData({
      dangqian_: this.data.jf_msg
    })
   
  },
  lishi: function() {
    console.log(this.data.wjf_msg, '历史')
    console.log("wjf_msg.type", typeof (this.data.wjf_msg))
    var that = this;
    that.setData({
      lishi_: this.data.wjf_msg
    })
  },

  //下拉刷新
  onPullDownRefresh: function(options) {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this
    that.dangqian()
    //历史
    that.lishi()

  },
})