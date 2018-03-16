
var util = require('../../utils/util.js');

//TODO 不必存储 isOpen editable finishImage

// pages/TSL/TSL.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TSList: [{}],
    addNew: false,//是否添加新项目
    left: [0],//项目的左边距 用于记录位置
    posLast: [0],//上一帧鼠标的位置 用于计算鼠标位移量delta
    lock: true,//为true仅查看 false可删除和编辑
    deviceHeight: wx.getSystemInfoSync().windowHeight * 0.9,
    editValue: '请输入...',//时序链中项目编辑时的字符串
    _TSL_ID: 0,//当前的时序链ID
    _TSL_COUNT: 0,//当前时序链的项目ID计数 使用它区别不同项目
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    _TSL_ID = option.TSL_ID;//确定要加载的是哪个时序链
    wx.getStorage({//获取当前时序链的项目计数
      key: _TSL_ID + '#' + 'COUNT',
      success: function (res) {
        _TSL_COUNT = res.data;
      },
    })
//TODO  初始化时序链


    console.log('当前加载TSL:' + _TSL_ID);

    var TSList = this.data.TSList;

    for (var i = 0; i < TSList.length; ++i) {
      TSList[i].inishedImage = 'finish';
    }

    this.setData({
      lock: false,
      TSList: TSList,
    });
  },

  /**
   * 项目标记为已完成和未完成
   */
  finishItem: function (e) {
    var index = e.currentTarget.id;
    var TSList = this.data.TSList;
    if (TSList[index].finished == undefined) {
      TSList[index].finished = '';
    }

    if (TSList[index].finished.length == 0) {
      TSList[index].finished = 'text-decoration:line-through;';
      TSList[index].finishedImage = 'finished';
      console.log('已完成:' + index);
    } else {
      TSList[index].finished = '';
      TSList[index].finishedImage = 'finish';
      console.log('未完成:' + index);
    }

    //更新数据
    this.setData({
      TSList: TSList,
    });

//TODO 存储数据
  },

  /**
   * 已编辑
   */
  editItemInput: function (e) {
    var str = e.detail.value;
    var index = e.currentTarget.id;
    var TSList = this.data.TSList;

    //若新值不合法则舍去 此时输入框关闭
    if (str == undefined || str.length == 0) {
      TSList[index].editable = false;
      console.log('未编辑：' + index);
    }
    else {
      //判断并提取摘要
      var digest = '';
      if (str.length > 15) {
        for (var i = 0; i < 16; ++i) {
          digest += str[i];
        }
        digest += '...';
      } else {
        digest = str;
      }

      //赋值
      TSList[index] = {
        time: util.formatTime(new Date()),
        digest: digest,
        content: str,
        isOpen: TSList[index].isOpen,//项目是否进入详情状态
        removed: TSList[index].removed,//项目是否被移除
        editable: false,//时序链中的项目是否处在编辑状态
        finished: TSList[index].finished,//项目是否已经完成
        finishedImage: TSList[index].finishedImage,//项目完成所使用的图片
      };
      console.log('已编辑：' + index);
    }

    //更新数据
    this.setData({
      TSList: TSList,
    })

    //存储数据
    var id = TSList[index].id;
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + time,
      data: util.formatTime(new Date()),
    });
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + digest,
      data: digest,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + content,
      data: str,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + isOpen,
      data: TSList[index].isOpen,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + removed,
      data: TSList[index].removed,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + editable,
      data: false,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + finished,
      data: TSList[index].finished,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + id + '#' + finishedImage,
      data: TSList[index].finishedImage,
    });


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
    var TSList = this.data.TSList;

    //若新值不合法则舍去 同时会取消编辑框
    if (str == undefined || str.length == 0) {
      console.log('未添加');
    }
    else {
      //判断并提取摘要
      var digest = '';
      if (str.length > 15) {
        for (var i = 0; i < 16; ++i) {
          digest += str[i];
        }
        digest += '...';
      } else {
        digest = str;
      }

      //插入数据
      TSList.unshift({

        time: util.formatTime(new Date()),
        digest: digest,
        content: str,
        isOpen: false,//项目是否进入详情状态
        removed: false,//项目是否被移除
        editable: false,//时序链中的项目是否处在编辑状态
        finished: '',//项目是否已经完成
        finishedImage: 'finish',//项目完成所使用的图片
      });
      console.log('已添加:\'' + TSList[0].content + '\'');
    }

    //更新数据
    this.setData({
      TSList: TSList,
      addNew: false
    })


    //存储数据
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'ID',
      data: _TSL_COUNT,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'time',
      data: util.formatTime(new Date()),
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'digest',
      data: digest,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'content',
      data: str,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'isOpen',
      data: false,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'removed',
      data: false,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'editable',
      data: false,
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'finished',
      data: '',
    });
    wx.setStorage({
      key: _TSL_ID + '#' + _TSL_COUNT + '#' + 'finishedImage',
      data: 'finish',
    });
    wx.setStorage({
      key: _TSL_ID + '#' + 'COUNT',
      data: ++_TSL_COUNT,
    })
  },

  /**
   * 将删除的项目恢复
   */
  recallItem: function (e) {
    var index = e.currentTarget.id;
    var TSList = this.data.TSList;

    TSList[index].removed = false;
    this.setData({
      TSList: TSList,
    });
    console.log('恢复:' + index);
  },

  /**
   * 压缩or整理时序链
   */
  packItems: function () {
    var TSList = this.data.TSList;

    for (var i = 0; i < TSList.length; ++i) {
      TSList[i].isOpen = false;
    }
    for (var i = 0; i < TSList.length; ++i) {
      if (TSList[i].removed) {
        TSList.splice(i, 1);
        console.log('已删除:' + i);
        //TODO 存储数据
        --i;
      }
    }


    this.setData({
      TSList: TSList,
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
   * 欲编辑
   */
  editItem: function (e) {
    var index = e.currentTarget.id;
    var TSList = this.data.TSList;
    var length = TSList.length;

    for (var i = 0; i < length; ++i) {
      TSList[i].editable = false;
    }
    TSList[index].editable = true;

    this.setData({
      TSList: TSList,
      editValue: TSList[index].content,
    });
    console.log('欲编辑:' + index);
  },

  /**
   * 移除一项
   */
  removeItem: function (e) {
    var index = e.currentTarget.id;
    var TSList = this.data.TSList;

    TSList[index].removed = true;
    this.setData({
      TSList: TSList,
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
    var index = parseInt(e.currentTarget.id);
    var TSList = this.data.TSList;

    TSList[index].isOpen = !TSList[index].isOpen;

    this.setData({
      TSList: TSList
    });
    ``
    if (TSList[index].isOpen) {
      console.log('已打开:' + index);
    }
    else {
      console.log('已折叠:' + index);
    }
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