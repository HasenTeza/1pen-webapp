// pages/m_index/add_bj/add_bj.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    zongjiage: 0,
    // showAddress:false
    goyxuanState: true,
    goyxuanState1: false,
    qingjiejiState: false,
    index: 0,
    array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    index1: 0,
    array1: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    Varieties: '',

    Warehouse: '',

    multiIndex: [0, 0, 0, 0, 0, 0],


    objectArray: [

      {

        id: 0,

        name: '选择品种大类'

      },

      {

        id: 1,

        name: '中国'

      },

      {

        id: 2,

        name: '巴西'

      },

      {

        id: 3,

        name: '日本'

      }

    ],

    index: 0,

    multiArray: [],

    year: "",

    month: "",

    day: "",

    startHour: "",

    // endHour: "",

    orderData: "选择预约时间"
  },

  /**
 
 * 生命周期函数--监听页面加载
 
 */

  onLoad: function (options) {


    //选择服务时间
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var surplusMonth = this.surplusMonth(year);
    // console.log(surplusMonth)
    var surplusDay = this.surplusDay(year, month, day);
    // console.log(surplusDay)
    var surplusHour = this.surplusHour(year, month, day, hour)
    // console.log(surplusHour)
    this.setData({
      multiArray: [
        // [year + '年', (year + 1) + '年', (year + 2) + '年'],
        [year + '', (year + 1) + '', (year + 2) + ''],
        surplusMonth,
        surplusDay,
        surplusHour[0],
        // ['~'],
        // surplusHour[1]
      ],

      year: year,
      month: month,
      day: day,
      startHour: surplusHour[0][0],
      // endHour: surplusHour[1][0],

    })

  },
  //input备注
  phoneInput: function (e) {
    // console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value
    })
  },
  //提交保洁订单
  dd_pay: function (o) {
    var that = this
    // console.log(app.globalData.openid)
    // console.log(o.currentTarget.dataset.t) //电话
    // console.log(o.currentTarget.dataset.d) //地址
    // console.log(o.currentTarget.dataset.n) //名字
    // console.log(this.data.goyxuanState ? '1' : '2') //服务类型
    // console.log(this.data.goyxuanState ? this.data.array[this.data.index] + '小时' : this.data.array1[this.data.index1] + '平方') //服务需求
    // console.log(this.data.inputVal) //备注
    // console.log(this.data.array[this.data.index]) //清洁剂消耗数量
    // console.log(this.data.nian + '-' + this.data.yue + '-' + this.data.ri + ' ' + this.data.shi) //预约时间
    var data = {
      mem_id: app.globalData.openid,
      mobile: o.currentTarget.dataset.t,
      address: o.currentTarget.dataset.d,
      type: this.data.goyxuanState ? '1' : '2',
      remark: this.data.inputVal,
      quantity: this.data.goyxuanState ? this.data.array[this.data.index] + '小时' : this.data.array1[this.data.index1] + '平方',
      cleaning_agent_count: this.data.array[this.data.index],
      ser_time: this.data.nian + '-' + this.data.yue + '-' + this.data.ri + ' ' + this.data.shi
    }
    console.log(data)
    wx.request({
      url: app.globalData.requestUrl + '/index/serorder/makeOrder',
      method: 'POST',
      header: {
        'content-type': ''
      },
      data: data,
      success: function (res) {
        // console.log(res.data.result.order_id, res.data.result.order_no)
        that.makePreOrder(res.data.result.order_id, res.data.result.order_no)
      }
    })
  },
  //生成微信预订单
  makePreOrder: function (order_id, order_no) {
    var that = this
    var data = {
      order_id: order_id,
      order_no: order_no,
      openid:app.globalData.openid
    }
    wx.request({
      url: app.globalData.requestUrl + '/index/xcxbjpay/pay',
      method: 'POST',
      header: {
        'content-type': ''
      },
      data: data,
      success: function (res) {
        console.log(res.data.result)
        that.wxPay(res.data.result,order_id)
      }
    })
  },
  //微信支付
  wxPay: function (data,order_id){
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.sign,
      success:function(){
        console.log()
        wx.navigateTo({
          url: '/pages/bj_dingdan/bj_dingdan?order_id=' + order_id,
        })
      }
    })
  },
  //提交保洁订单
  tijiao: function (o) {

    var that = this

    if (!o.currentTarget.dataset.t) {
      console.log('请选择地址')
      wx.showModal({
        title: '提示',
        content: '请选择地址',
        showCancel: false,
        canceText: '算了吧',
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) { } else if (res.cancel) { }
        }
      })
      return false
    } else if (this.data.zongjiage == 0) {
      console.log('请选择服务类型')
      wx.showModal({
        title: '提示',
        content: '请选择服务类型',
        showCancel: false,
        canceText: '算了吧',
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) { } else if (res.cancel) { }
        }
      })
      return false
    } else if (!this.data.nian && !this.data.yue && !this.data.ri && !this.data.shi) {
      console.log('请选择服务时间')
      wx.showModal({
        title: '提示',
        content: '请选择服务时间',
        showCancel: false,
        canceText: '算了吧',
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) { } else if (res.cancel) { }
        }
      })
      return false
    }
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(700).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus1: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)


  },

  //选择地址
  choose_address: function () {
    wx.navigateTo({
      url: '/pages/address/address?from=order',
    })
  },
  //选择服务类型
  t_gouxuan: function () {
    if (this.data.goyxuanState == true) {
      this.setData({
        goyxuanState: false,
      })
    } else {
      this.setData({
        goyxuanState: true,
        index1: 0,
        zongjiage: 0
      })
    }
    if (this.data.goyxuanState1 == false) {
      this.setData({
        goyxuanState1: true,
        index: 0,
        zongjiage: 0,
        qingjiejiState: false
      })
    } else {
      this.setData({
        goyxuanState1: false,
      })
    }
  },
  //勾选清洁剂
  qingjieji: function () {
    //当选择是按小时时执行
    if (this.data.goyxuanState == true) {
      if (this.data.qingjiejiState == false) {
        this.setData({
          qingjiejiState: true,
          zongjiage: this.data.zongjiage + 5 * this.data.array[this.data.index],
          qingjiejg: 5 * this.data.array[this.data.index]
        })
      } else {
        this.setData({
          qingjiejiState: false,
          zongjiage: this.data.zongjiage - 5 * this.data.array[this.data.index],
          qingjiejg: 5 * this.data.array[this.data.index]
        })
      }
    } else {
      this.btnclick();
    }



  },
  btnclick: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '选择小时制才能勾选',
      showCancel: true,
      canceText: '算了吧',
      confirmText: '去选择',
      success: function (res) {
        if (res.confirm) {
          that.t_gouxuan()
          that.showModal()
        } else if (res.cancel) { }
      }
    })
  },


  //小时收费
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      zongjiage: this.data.array[e.detail.value] * 40 + 15,
      xiaoshijg: this.data.array[e.detail.value] * 40
    })
    if (this.data.qingjiejiState == true) {
      this.setData({
        zongjiage: this.data.zongjiage + 5 * this.data.array[this.data.index]
      })
    }
  },
  //面积收费
  bindPickerChange1: function (e) {
    // console.log('picker发送选择改变，携带值为', e, e.detail.value)
    this.setData({
      index1: e.detail.value,
      zongjiage: this.data.array1[e.detail.value] * 3 + 15,
      pingfangjg: this.data.array1[e.detail.value] * 3
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        showModalStatus1: false
      })
    }.bind(this), 200)
  },

  //预约时间
  //月份计算

  surplusMonth: function (year) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var monthDatas = [];
    if (year == year2) {
      var surplusMonth = 12 - month;
      // monthDatas.push(month + "月")
      monthDatas.push(month + "")
      for (var i = month; i < 12; i++) {
        // monthDatas.push(i + 1 + "月")
        monthDatas.push(i + 1 + "")
      }
    } else {
      for (var i = 0; i < 12; i++) {
        // monthDatas.push(i + 1 + "月")
        monthDatas.push(i + 1 + "")
      }
    }
    return monthDatas;
  },

  //天数计算
  surplusDay: function (year, month, day) {
    var days = 31;
    var dayDatas = [];
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1
    switch (parseInt(month)) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        days = 31;
        break;
      //对于2月份需要判断是否为闰年
      case 2:
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
          days = 29;
          break;
        } else {
          days = 28;
          break;
        }
      case 4:
      case 6:
      case 9:
      case 11:
        days = 30;
        break;
    }

    if (year == year2 && month == month2) {
      // dayDatas.push(day + "日")
      dayDatas.push(day + "")
      for (var i = day; i < days; i++) {
        // dayDatas.push(i + 1 + "日")
        dayDatas.push(i + 1 + "")
      }
    } else {
      // console.log(month + "月" + days + "天")
      for (var i = 0; i < days; i++) {
        // dayDatas.push(i + 1 + "日")
        dayDatas.push(i + 1 + "")
      }
    }
    return dayDatas;
  },

  //时间计算
  surplusHour: function (year, month, day, hour) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1
    var day2 = date.getDate();
    // var hourEnd = [4, 8, 12, 16, 20, 24];

    var hours = [
      // ['00时', '04时', '08时', '12时', '16时', '20时'],
      // ['04时', '08时', '12时', '16时', '20时', '24时']
      ['00', '04', '08', '12', '16', '20'],
      ['04', '08', '12', '16', '20', '24']
    ];

    if (year == year2 && month == month2 && day == day2) {
      var hour2 = hour
      var j = 0;
      // for (var i = 0; i < hourEnd.length; i++) {

      //   console.log("离24点还" + (hourEnd[i] - hour))

      //   if ((hourEnd[i] - hour) > 0) {

      //     console.log("i" + i)

      //     j = i;

      //     break;

      //   }

      // }

      var surplusHours = [
        [],
        []
      ];

      for (var i = j; i < hours[0].length; i++) {
        // console.log(hours[0][i])
        surplusHours[0].push(hours[0][i]);
      }
      for (var i = j; i < hours[1].length; i++) {
        // console.log(hours[1][i])
        surplusHours[1].push(hours[1][i]);
      }
      hours = surplusHours;
    }
    return hours;
  },


  varietiesChange: function (e) {
    var Varieties = this.data.array[parseInt(e.detail.value)]
    // console.log(Varieties)
    this.setData({
      Varieties: Varieties
    })
  },

  warehouseChange: function (e) {
    var Warehouse = this.data.array[parseInt(e.detail.value)]
    // console.log(Warehouse)
    this.setData({
      Warehouse: Warehouse
    })
  },

  //某一列的值改变时触发

  bindMultiPickerColumnChange: function (e) {

    var date = new Date();
    var year1 = date.getFullYear()
    var month1 = date.getMonth() + 1
    var day1 = date.getDate()
    var hour1 = date.getHours()
    // console.log("当前年份" + this.data.month + '修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
      startHour: this.data.startHour,
      endHour: this.data.startHour,
    };

    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {

      case 0:
        var yearStr = data.multiArray[e.detail.column][e.detail.value];
        var year = yearStr.substring(0, yearStr.length - 1)
        data.year = parseInt(year);
        var surplusMonth = this.surplusMonth(year);
        data.multiArray[1] = surplusMonth;
        if (data.year == year1) {
          data.month = month1;
        } else {
          data.month = 1;
        }
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }
        var surplusDay = this.surplusDay(data.year, data.month, data.day);
        data.multiArray[2] = surplusDay;
        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day)
        }
        // console.log(surplusHour)

        data.multiArray[3] = surplusHour[0];

        // data.multiArray[5] = surplusHour[1];

        data.startHour = surplusHour[0];

        // data.endHour = surplusHour[1];

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        // data.multiIndex[5] = 0;
        break;
      case 1:
        // console.log('选择月份' + data.multiArray[e.detail.column][e.detail.value]);
        var monthStr = data.multiArray[e.detail.column][e.detail.value];
        var month = monthStr.substring(0, monthStr.length - 1);
        data.month = month;
        data.day = 1;
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        var surplusDay = this.surplusDay(data.year, data.month, data.day);
        data.multiArray[2] = surplusDay;
        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {

          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)

        } else {

          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)

        }

        data.multiArray[3] = surplusHour[0];
        // data.multiArray[5] = surplusHour[1];
        data.startHour = surplusHour[0];
        // data.endHour = surplusHour[1];
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        // data.multiIndex[5] = 0;
        break;
      case 2:
        // console.log('选择日' + data.multiArray[e.detail.column][e.detail.value]);
        var dayStr = data.multiArray[e.detail.column][e.detail.value];
        var day = dayStr.substring(0, dayStr.length - 1);
        data.day = day;
        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {

          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)

        } else {

          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)

        }



        data.multiArray[3] = surplusHour[0];
        // data.multiArray[5] = surplusHour[1];
        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];
        data.multiIndex[3] = 0;
        // data.multiIndex[5] = 0;
        break;
      case 3:

        // console.log('起始时间' + data.multiArray[e.detail.column][e.detail.value]);

        var hourStr = data.multiArray[e.detail.column][e.detail.value];
        var hour = hourStr.substring(0, hourStr.length - 1);
        data.startHour = hour;
        // console.log('起始时间' + hour);

        var endhours2 = [];

        if (data.year == year1 && data.month == month1 && data.day == day1) {

          var surplusHour = this.surplusHour(data.year, data.month, data.day, hour);

          endhours2 = surplusHour[1]

        } else {

          // var end = ['04时', '08时', '12时', '16时', '20时', '24时'];

          // for (var i = e.detail.value; i < end.length; i++) {

          //   endhours2.push(end[i]);

          // }

        }

        // data.multiArray[5] = endhours2;

        data.multiIndex[5] = 0;



        break;

      case 5:

        // var hourStr = data.multiArray[e.detail.column][e.detail.value];

        // var hour = hourStr.substring(0, hourStr.length - 1);

        // data.endHour = hour;

        console.log('结束时间' + data.multiArray[e.detail.column][e.detail.value]);

        break;

    }

    this.setData(data)



  },

  //value 改变时触发 change 事件

  bindMultiPickerChange: function (e) {

    // var dateStr =

    //   this.data.multiArray[0][this.data.multiIndex[0]] +

    //   this.data.multiArray[1][this.data.multiIndex[1]] +

    //   this.data.multiArray[2][this.data.multiIndex[2]] +

    //   this.data.multiArray[3][this.data.multiIndex[3]]

    // // this.data.multiArray[4][this.data.multiIndex[4]] +

    // // this.data.multiArray[5][this.data.multiIndex[5]];

    // console.log('picker发送选择改变，携带值为', dateStr)

    // console.log(nian)
    this.setData({
      nian: this.data.multiArray[0][this.data.multiIndex[0]],
      yue: this.data.multiArray[1][this.data.multiIndex[1]],
      ri: this.data.multiArray[2][this.data.multiIndex[2]],
      shi: this.data.multiArray[3][this.data.multiIndex[3]]
    })

  }
})