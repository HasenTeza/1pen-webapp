// pages/orders/orders_pl/orders_pl.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_l: '',
    imgs: [],
    imgs_s: [],
    image1: [],
    imagestatus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      url1: options.url,
      pro_id: options.pro_id,
      orderid: options.orderid,
      from: options.from
    })
    console.log(this.data)
  },

  //获取评论内容
  bindinput: function (e) {
    this.setData({
      inputvalue: e.detail.value
    })
  },
  //是否匿名
  niming: function () {
    if (this.data.nm_status) {
      this.setData({
        nm_status: false
      })
    } else {
      this.setData({
        nm_status: true
      })
    }
  },
  //商品评价
  s_pingfen: function (e) {
    var index = e.target.dataset.aa;
    console.log(e.target.dataset.aa)
    this.setData({
      sp_index: index
    })
  },
  //店铺评分
  x_pingfen: function (e) {
    // console.log('1',e.target.dataset.index)
    var index = e.target.dataset.index;
    this.setData({
      pf_index: index
    })
  },

  

  chooseImg: function () {
    var _this = this;
    _this.setData({
      image1: []
    })
    wx.chooseImage({

      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //预览时的图片数组（暂时无用）
        for (var index in res.tempFiles) {
          _this.data.imgs_s.push(res.tempFiles[index].path)
        }

        //隐藏添加按钮
        if (_this.data.image1.length === 3) {
          _this.setData({
            imagestatus: false
          })
        }
        _this.setData({
          src_status: true,
          image1: res.tempFilePaths,
          image_s: res.tempFiles
        })
        wx.showModal({
          title: '图片',
          content: '确认上传此图片',
          success: function (res) {
            if (res.confirm) {
             
              // console.log(_this.data.image1)
              for (var i = 0, h = _this.data.image1.length; i < h; i++) {
                wx.uploadFile({
                  url: 'https://cool.1peng.com.cn/xcx/wxapp/public/index/address/add', //接口
                  filePath: _this.data.image1[i],
                  name: 'image1',
                  formData: {
                    'user': 'test'
                  },
                  success: function (res) {
                    var obj = JSON.parse(res.data)
                    _this.data.imgs.push(obj.res)
                  },
                  fail: function (error) {
                    console.log(error);
                  }
                })
              }

              _this.setData({
                imagestatus: false
              })


            } else {
              console.log('弹框后点取消', '222')
              _this.setData({
                src_status: false,
                image1: [],
                image_s: []
              })
            }
          }
        })


      }
    })
  },
 
  preview_img: function (e) {
    // console.log(this.data.image_s, this.data.image1)
    // var urls = e.currentTarget.dataset.src
    wx.previewImage({
      current: this.data.image1, // 当前显示图片的http链接
      // urls: this.data.imgs_s // 需要预览的图片http链接列表
      urls: this.data.image1 // 需要预览的图片http链接列表
    })
  },

  //发表评论
  btn: function () {
    var that = this
    // console.log(that.data.imgs)
    //上传图片
   
    that.datata(that.data.imgs)

  },
  datata: function (imgs) {
    //提交数据

    var that = this
    var data = {
      order_no:that.data.orderid,
      from:that.data.from,
      bis_id: app.globalData.bis_id,
      telephone: app.globalData.telephone,
      wx_id: app.globalData.openid,
      pro_id: this.data.pro_id,
      describe: this.data.inputvalue,
      status: this.data.sp_index,
      anonymous: this.data.nm_status,
      score: this.data.pf_index,
      image1: imgs[0],
      image2: imgs[1],
      image3: imgs[2]
    }
    console.log(data)

    wx.request({
      url: 'https://cool.1peng.com.cn/xcx/wxapp/public/index/Evaluate/addEvaluate',
      data: data,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res)
        var pages = getCurrentPages();             //  获取页面栈
        var currPage = pages[pages.length - 1];    // 当前页面
        var prevPage = pages[pages.length - 3];    // 上一个页面

        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})