// pages/m_index/tuijian/tuijian.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/index/getDanProInfo',
      header: {
        'content-type': ''
      },
      method: "POST",
      data: {
        bis_id: app.globalData.bis_id,
        page: that.data.page
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          new_pro_info: res.data.result
        })
      }
    })
  },
  //跳转详情
  xiangqing: function (e) {
    // console.log(e.currentTarget.dataset.pro_id)
    wx.navigateTo({
      url: '/pages/pro_detail/pro_detail?pro_id=' + e.currentTarget.dataset.pro_id,
    })
  },
  //下拉刷新
  onPullDownRefresh: function (options) {
    var that = this
    this.setData({
      page: 1
    })

    wx.showNavigationBarLoading() //在标题栏中显示加载

    wx.request({
      url: app.globalData.requestUrl + '/index/index/getDanProInfo',
      header: {
        'content-type': ''
      },
      method: "POST",
      data: {
        bis_id: app.globalData.bis_id,
        page: that.data.page
      },
      success: function (res) {
        that.setData({
          new_pro_info: res.data.result
        })

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {    //上拉事件
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    var page =this.data.page;
    page++;
    //更改data
    that.setData({
      page: page
    })
    
    wx.request({
      url: app.globalData.requestUrl + '/index/index/getDanProInfo',
      header: {
        'content-type': ''
      },
      method: "POST",
      data: {
        bis_id: app.globalData.bis_id,
        page: page
      },
      success: function (res) {
        //定义数组
        var new_pro_info_list = that.data.new_pro_info;
        for (var i = 0; i < res.data.result.length; i++) {
          //添加新的
          new_pro_info_list.push(res.data.result[i]);
        }
        
        // 设置数据
        that.setData({
          new_pro_info: new_pro_info_list
        })
        // 隐藏加载框
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })

  }
 
})