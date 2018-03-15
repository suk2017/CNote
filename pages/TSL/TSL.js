
var util = require('../../utils/util.js');
// pages/TSL/TSL.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TSList: [
      {
        time: "2018/3/15 12:00:00",
        digest: "给她发消息，已经放在了聊天框里...",
        content: "给她发消息，已经放在了聊天框里，是草稿",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      },
      {
        time: "2018/3/15 20:00:00",
        digest: "CCTV2看315晚会",
        content: "CCTV2看315晚会",
        finished: false,
      }
    ],
    isOpen: [false],//项目是否进入详情状态
    addNew: false,//是否添加新项目
    left: [0],//项目的左边距 用于记录位置
    posLast: [0],//上一帧鼠标的位置 用于计算鼠标位移量delta
    lock: true,//为true仅查看 false可删除和编辑
    removed: [false],//时序链
    deviceHeight: wx.getSystemInfoSync().windowHeight * 0.9,
    editable: [false],//时序链中的项目是否处在编辑状态
    editValue: '请输入...',//时序链中项目编辑时的字符串
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function () {
    console.log(wx.getSystemInfoSync().windowWidth * 0.9);
    this.setData({
      lock: false,
    });
  },

  /**
   * 已编辑
   */
  editItemInput: function (e) {
    var str = e.detail.value;
    var index=e.currentTarget.id;
    
    if (str == undefined || str.length == 0) {
      return;
    }

    var temp = {
      content: str,
    };
    if (str.length > 15) {
      for (var i = 0; i < 16; ++i) {
        temp.digest += str[i];
      }
      temp.digest += '...';
    } else {
      temp.digest = temp.content;
    }
    temp.time = util.formatTime(new Date());

    //this.data.TSList.unshift(temp);
    this.data.TSList[index] = temp;
    this.data.editable[index] = false;
    this.setData({
      TSList: this.data.TSList,
      editable:this.data.editable,
    })

    console.log('已编辑：');
  },

  /**
   * 刚刚触摸开始
   */
  itemStartMove: function (e) {
    if (!this.data.lock) { return; }
    var index = e.currentTarget.id;
    var pos = e.touches[0].clientX;
    this.data.posLast[index] = pos;
    this.setData({
      posLast: this.data.posLast,
    });
  },

  /**
   * 触摸进行中
   */
  itemMove: function (e) {
    if (!this.data.lock) {
      return;
    }
    var index = e.currentTarget.id;
    var pos = e.touches[0].clientX;
    var delta = pos - this.data.posLast[index];
    this.data.left[index] += delta;
    this.setData({
      left: this.data.left,
    });
    this.data.posLast[index] = pos;
  },

  /**
   * 输入新项
   */
  inputNewItem: function (e) {
    var str = e.detail.value;
    console.log('str:' + str);
    if (str == undefined || str.length == 0) {
      return;
    }
    var temp = {
      content: str,
    };
    if (str.length > 15) {
      for (var i = 0; i < 16; ++i) {
        temp.digest += str[i];
      }
      temp.digest += '...';
    } else {
      temp.digest = temp.content;
    }
    temp.time = util.formatTime(new Date());

    //this.data.TSList.push(temp);
    this.data.TSList.unshift(temp);
    this.setData({
      TSList: this.data.TSList,
      addNew: false
    })
    console.log('已添加：' + this.data.TSList[this.data.TSList.length - 1].content);


  },

  /**
   * 将删除的项目恢复
   */
  recallItem: function (e) {
    var index = e.currentTarget.id;
    this.data.removed[index] = false;
    this.setData({
      removed: this.data.removed
    });
    console.log('恢复:' + index);
  },

  /**
   * 压缩or整理时序链
   */
  packItems: function () {
    console.log('ok');
    for (var i = 0; i < this.data.isOpen.length; ++i) {
      this.data.isOpen[i] = false;
    }
    this.setData({
      isOpen: this.data.isOpen,
    })
    console.log('已压缩');
  },

  /**
   * 是否锁定面板
   */
  lockPanel: function () {
    this.setData({
      lock: !this.data.lock,
    })
    console.log('已锁定');
  },
  /**
   * 编辑
   */
  editItem: function (e) {
    var index = e.currentTarget.id;
    var length = this.data.editable.length;
    for (var i = 0; i < length; ++i) {
      this.data.editable[i] = false;
    }
    this.data.editable[index] = true;
    this.setData({
      editable: this.data.editable,
      editValue: this.data.TSList[index].content,
    });
    console.log('编辑:' + index);
  },
  /**
   * 移除一项
   */
  removeItem: function (e) {
    var index = e.currentTarget.id;
    this.data.removed[index] = true;
    this.setData({
      removed: this.data.removed
    });
    console.log('移除:' + index);
  },

  /**
   * 点击加号创建新项
   */
  addNewItem: function () {
    this.setData({ addNew: !this.data.addNew });
  },

  /**
   * 点击项目打开详情
   */
  openItem: function (e) {
    //因为二选一 所以不会出现相同id
    var index = parseInt(e.currentTarget.id);
    this.data.isOpen[index] = !this.data.isOpen[index];
    this.setData({ isOpen: this.data.isOpen });
  },



  onLoad2: function () {

    var myUtil = require('../../utils/md5.js');
    var appid = '20180214000122664';
    var key = 'EcN1ABdl71i94xAO4alO';
    var salt = (new Date).getTime();
    var query = 'apple';
    var _from = 'en';
    var to = 'zh';
    var str1 = appid + query + salt + key;
    var sign = myUtil.hexMD5(str1);
    var that = this;
    console.log('开始');
    wx.request({
      //url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
      url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      //url: 'http://localhost/index.php',
      type: 'get',
      dataType: 'jsonp',
      data: {
        q: query,
        appid: appid,
        salt: salt,
        from: _from,
        to: to,
        sign: sign
      },
      success: function (data) {
        console.log('成功');
        var uc = require('../../utils/UnicodeConvert.js');
        var result = uc.toChinese(data.data);
        that.setData({ msg: result });
        console.log(data.data);
      },
      fail: function (res) {
        console.log('失败')
      }
    });
    console.log('结束');
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