// pages/m_index/search/search.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: true,
    shangpin: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var that = this
    var bis_id = app.globalData.bis_id
    //最近搜索
    wx.request({
      url: app.globalData.requestUrl + '/index/Product/historySearch',
      data: {
        bis_id: bis_id,
      },
      header: {
        'content-type': ''
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        that.setData({
          zuijin: res.data.result
        })
      }
    })

    //热词搜索
    wx.request({
      url: app.globalData.requestUrl + '/index/Product/getHotSearchWords',
      data: {
        bis_id: bis_id,
      },
      header: {
        'content-type': ''
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        that.setData({
          reci: res.data.result
        })
      }
    })
  },
  //获取input内容进行搜索
  bindinput: function(e) {
    this.sousuokuang(e.detail.value)
  },
  //搜索内容点击
  sousuoClick: function(e) {
    this.setData({
      djsp_name: e.target.dataset.word
    })
    this.sousuokuang(e.target.dataset.word)
  },
  //搜索框
  sousuokuang: function(value) {
    var that = this
    var inputVal = value
    if (inputVal == '') {
      that.setData({
        state: true,
        shangpin: null
      })
      return
    } else {
      that.setData({
        state: false,
      })
    }
    var bis_id = app.globalData.bis_id
    wx.request({
      url: app.globalData.requestUrl +'/index/Product/getOrgProInfoBySearch',
      data: {
        bis_id: bis_id,
        param: inputVal
      },
      method: 'POST',
      header: {
        'content-type': ''
      },
      success: function(res) {

        console.log(res.data.result)
        if (res.data.result.length > 0) {
          that.setData({
            shangpin: res.data.result
          })
        }

      }
    })
  },
  //商品详情
  sp_xiangqing:function(e){
    // console.log(e.currentTarget.dataset.pro_id)
    var pro_id = e.currentTarget.dataset.pro_id
    wx.navigateTo({
      url: '/pages/pro_detail/pro_detail?pro_id=' + pro_id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})