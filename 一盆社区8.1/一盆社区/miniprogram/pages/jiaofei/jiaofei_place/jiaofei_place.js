Page({
  data: {},
  //相当于JS中的方法 与页面绑定的bindPickerChange_xq对应
  //前端点击了小区的下拉就会触发这个方法，那么在这个方法里一旦选择了小区那么就要把对应的楼栋准备好
  //不然点击楼栋就会没数据对吧，所以下面就根据获取的小区下标获取小区编码在通过小区编码获取楼栋
  bindPickerChange_xq: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    //获取页面选择的小区数组下标赋值给hx_index
    this.setData({  
      hx_index: e.detail.value, 
    })
    //结合onload方法存储的pic_array和刚获取的hx_index根据返回数据路径获取小区编码
    var community_code = this.data.pic_array[this.data.hx_index].community_code;
    var that = this;
    //小程序里的ajax
    wx.request({
      url: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/house/getBuilding",
      method: "POST",
      data: {
        community_code: community_code  //参数
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('楼栋获取成功：')
        console.log(res)
        //把获取的楼栋信息赋值给ld_array给前端页面select显示
        that.setData({
          ld_array: res.data.result,
        })
      }
    })
    console.log(e.detail.value);
  },
  
  //和上面小区方法一个道理 你选择楼栋的同时就要把这个楼栋下面对应的房号都准备好
  bindPickerChange_ld: function (e) {
    var that = this;
    console.log('bindPickerChange_ld', e.detail.value);
    var ld_index;
    this.setData({
      ld_index: e.detail.value,
    })
    var community_code = this.data.pic_array[this.data.hx_index].community_code;
    var building_code = this.data.ld_array[this.data.ld_index].building_code;
    wx.request({
      url: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/house/getHouse",
      method: "POST",
      data: {
        community_code: community_code ,
        building_code: building_code  
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('房屋获取成功：')
        console.log(res)
        that.setData({
          fw_array: res.data.result,
        })
      }
    })
    console.log('building_code', building_code);
  },
  
  bindPickerChange_fw: function (e) {
    var that = this;
    var fw_index;
    this.setData({
      fw_index: e.detail.value,
    })
    var community_code = this.data.pic_array[this.data.hx_index].community_code;
    var building_code = this.data.ld_array[this.data.ld_index].building_code;
    var house_code = this.data.fw_array[this.data.fw_index].house_code;
    console.log('小区', community_code);
    console.log('楼号', building_code);
    console.log('房屋号：', house_code);
    wx.request({
    url:"https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/Expense/getExpenses",
      method: "POST",
      data: {
        community_code: community_code,
        building_code: building_code,
        house_code:house_code,
        pay_data:1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //如果能查询成功
        if (res.data.statuscode){
          that.setData({
            jf_array: res.data.result,
          })
        }else{
          //查询失败
          that.setData({
            jf_array: 0,
          })
        }
        console.log('缴费信息', res.data)
      }
    })
    //未缴费
    wx.request({
      url: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/Expense/getExpenses",
      method: "POST",
      data: {
        community_code: community_code,
        building_code: building_code,
        house_code: house_code,
        pay_data: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
         //如果能查询成功
        if (res.data.statuscode==1) {
          that.setData({
            wjf_array: res.data.result,
          })
        } else {
          //查询失败
          that.setData({
            wjf_array: 0,
          })
        }
        console.log('未缴费信息', res.data)
      }
    })
  },

  login: function () {
    // 1.跳转页面，有返回符号
    if (this.data.jf_array!=0)
      {
      var jf_msg = JSON.stringify(this.data.jf_array);
      }else{
      var jf_msg=0;
      }
    if (this.data.wjf_array != 0)
    {
      var wjf_msg = JSON.stringify(this.data.wjf_array);
    }else{
      var wjf_msg =0;
    }
    wx.navigateTo({
      url: '../jiaofei?jf_msg=' + jf_msg+'&wjf_msg='+wjf_msg,
    })
    console.log('ontap')

    // 跳转页面 没有返回符号
    // wx.redirectTo({
    //   url: '../posts3/post',
    // })
  },

//载入界面后会立即先执行onload方法 在这里首先获取所有小区 然后传递给前端 让用户直接就能选小区
  onLoad: function () {
    //this不能直接赋值用 所以用that代替
    var that = this;
    //获取所有小区信息
    wx.request({
      url: "https://www.ypzhsq.com/xcx/wxapp/public/index.php/index/house/getCommunity",
      // data: {
      //   a: ""  //参数
      // },
      //设置请求类型 是json 必须选这个 不然有值的ajax会失效
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data.result)
        //赋值给pic_array在页面内用pic_array的数据
        that.setData({
          pic_array: res.data.result,  
        })
      }
    })
  },
})