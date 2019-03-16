// pages/TSLs/TSLs.js
var util = require('../../utils/util.js');
var _TSL_ID = 0;//当前的时序链ID
var _TSL_COUNT = 0;//当前时序链的项目ID计数 使用它区别不同项目
var changed = false;//是否已改变 若true则需要重新保存

// pages/TSL/TSL.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _TSL_List: [],
    addNew: false,//是否添加新项目
    left: [0],//项目的左边距 用于记录位置
    posLast: [0],//上一帧鼠标的位置 用于计算鼠标位移量delta
    lock: true,//为true仅查看 false可删除和编辑
    deviceHeight: wx.getSystemInfoSync().windowHeight * 0.9,
    editValue: '请输入...',//时序链中项目编辑时的字符串
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    _TSL_ID = option.TSL_ID;
    //var _TSL_ID = option.TSL_ID;//确定要加载的是哪个时序链
    var _TSL_COUNT = 0;
    changed = false;

    _TSL_COUNT = wx.getStorageSync(_TSL_ID + '#' + 'COUNT')
    console.log('当前链ID:' + _TSL_ID);
    console.log('初始长度:' + this.data._TSL_List.length);
    console.log('当前count:' + _TSL_COUNT);


    var objList = [];
    var time;
    var digest;
    var content;
    var isOpen;
    var removed;
    var editable;
    var finished;
    var finishedImage;
    var step = 0;
    var count = _TSL_COUNT;
    var firstItemRemoved = '-';//第一个被删除的项目
    //for (var i = count - 1; i > -1; --i) {
    for (var i = 0; i < count; ++i) {
      //首先判断是否已被移除
      removed = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'removed');
      if (removed) {
        if (firstItemRemoved == '-') {
          firstItemRemoved = '' + i;
        }
        --_TSL_COUNT;
        console.log('已清除:' + i);
        continue;
      }

      //若未被移除 则读取剩余数据
      time = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'time');
      digest = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'digest');
      content = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'content');
      finished = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'finished');
      isOpen = false;
      editable = false;
      if (!finished || finished.length == 0) {//若未完成
        finished = '';
        finishedImage = 'finish';
      } else {//若已完成
        finished = 'text-decoration:line-through;';
        finishedImage = 'finished';
      }

      //装载进入预制的对象数组
      objList.push({
        id: step,//重设id
        time: time,
        digest: digest,
        content: content,
        isOpen: isOpen,
        removed: removed,
        editable: editable,
        finished: finished,
        finishedImage: finishedImage,
      })
      ++step;
    }

    //更新数据
    this.setData({
      _TSL_List: objList,
    });

    //存储数据
    //wx.setStorageSync(_TSL_ID + '#' + 'COUNT', _TSL_COUNT);

    console.log('当前加载TSL:id=' + _TSL_ID + ' count=' + _TSL_COUNT);

    // //从第一个被删除的项目开始 重写内容
    // for (var i = firstItemRemoved; i < _TSL_COUNT; ++i) {
    //   //存储数据
    //   wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'ID', i);
    //   wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'time', objList[i].time);
    //   wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'digest', objList[i].digest);
    //   wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'content', objList[i].content);

    //   wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'removed', false);

    //   wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'finished', objList[i].finished);

    // }
  },

  /**
   * 项目标记为已完成和未完成
   */
  finishItem: function (e) {
    var index = e.currentTarget.id;
    var _TSL_List = this.data._TSL_List;
    if (_TSL_List[index].finished == undefined) {
      _TSL_List[index].finished = '';
    }

    if (_TSL_List[index].finished.length == 0) {
      _TSL_List[index].finished = 'text-decoration:line-through;';
      _TSL_List[index].finishedImage = 'finished';
      console.log('已完成:index=' + index + ' id=' + _TSL_List[index].id);
    } else {
      _TSL_List[index].finished = '';
      _TSL_List[index].finishedImage = 'finish';
      console.log('未完成:index=' + index + ' id=' + _TSL_List[index].id);
    }

    //更新数据
    this.setData({
      _TSL_List: _TSL_List,
    });
    changed = true;
    console.log('1');

    //存储数据
    // wx.setStorageSync(this.data._TSL_ID + '#' + _TSL_List[index].id + '#' + finished, _TSL_List[index].finished);
  },

  /**
   * 已编辑
   */
  editItemInput: function (e) {
    var str = e.detail.value;
    var index = e.currentTarget.id;
    var _TSL_List = this.data._TSL_List;
    //var _TSL_ID = this.data._TSL_ID;
    var id = _TSL_List[index].id;

    //若新值不合法则舍去 此时输入框关闭
    if (str == undefined || str.length == 0) {
      _TSL_List[index].editable = false;
      console.log('未编辑：index=' + index + ' id=' + id);
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
      _TSL_List[index] = {
        time: util.formatTime(new Date()),
        digest: digest,
        content: str,
        isOpen: _TSL_List[index].isOpen,//项目是否进入详情状态
        removed: _TSL_List[index].removed,//项目是否被移除
        editable: false,//时序链中的项目是否处在编辑状态
        finished: _TSL_List[index].finished,//项目是否已经完成
        finishedImage: _TSL_List[index].finishedImage,//项目完成所使用的图片
      };
      console.log('已编辑：index=' + index + ' id=' + id);
    }


    //存储数据
    // wx.setStorageSync(_TSL_ID + '#' + id + '#' + time, util.formatTime(new Date()))
    // wx.setStorageSync(_TSL_ID + '#' + id + '#' + digest, digest)

    // wx.setStorageSync(_TSL_ID + '#' + id + '#' + content, str)

    // wx.setStorageSync(_TSL_ID + '#' + id + '#' + removed, _TSL_List[index].removed)


    // wx.setStorageSync(_TSL_ID + '#' + id + '#' + finished, _TSL_List[index].finished)



    //更新数据
    this.setData({
      _TSL_List: _TSL_List,
    })
    changed = true;
    console.log('2');
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
   * 添加新项
   */
  inputNewItem: function (e) {
    var str = e.detail.value;
    var _TSL_List = this.data._TSL_List;
    //var _TSL_ID = this.data._TSL_ID;

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
      _TSL_List.unshift({
        id: _TSL_List.length,//id和index相反
        time: util.formatTime(new Date()),
        digest: digest,
        content: str,
        isOpen: false,//项目是否进入详情状态
        removed: false,//项目是否被移除
        editable: false,//时序链中的项目是否处在编辑状态
        finished: '',//项目是否已经完成
        finishedImage: 'finish',//项目完成所使用的图片
      });
      console.log('已添加:\'' + _TSL_List[0].content + '\'' + ' id:' + _TSL_List[0].id);
    }
    //更新数据
    this.setData({
      _TSL_List: _TSL_List,
      addNew: false,
    })
    changed = true; console.log('3');


    //存储数据



  },

  /**
   * 将删除的项目恢复
   */
  recallItem: function (e) {
    var index = e.currentTarget.id;
    var _TSL_List = this.data._TSL_List;

    _TSL_List[index].removed = false;
    this.setData({
      _TSL_List: _TSL_List,
    });
    console.log('恢复:index=' + index + ' id=' + _TSL_List[index].id);
  },

  /**
   * 压缩or整理时序链
   */
  packItems: function () {
    var _TSL_List = this.data._TSL_List;

    for (var i = 0; i < _TSL_List.length; ++i) {
      _TSL_List[i].isOpen = false;
    }
    // for (var i = 0; i < _TSL_List.length; ++i) {
    //   if (_TSL_List[i].removed) {
    //     _TSL_List.splice(i, 1);
    //     console.log('已删除:' + i);
    //     //TODO 存储数据
    //     --i;
    //   }
    // }


    this.setData({
      _TSL_List: _TSL_List,
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
    var _TSL_List = this.data._TSL_List;
    var length = _TSL_List.length;

    for (var i = 0; i < length; ++i) {
      _TSL_List[i].editable = false;
    }
    _TSL_List[index].editable = true;

    this.setData({
      _TSL_List: _TSL_List,
      editValue: _TSL_List[index].content,
    });
    console.log('欲编辑:index=' + index + ' id=' + _TSL_List[index].id);
  },

  /**
   * 移除一项
   */
  removeItem: function (e) {
    var index = e.currentTarget.id;
    var _TSL_List = this.data._TSL_List;

    _TSL_List[index].removed = true;

    //更新数据
    this.setData({
      _TSL_List: _TSL_List,
    });
    changed = true; console.log('4');

    //存储数据
    // wx.setStorageSync(this.data._TSL_ID + '#' + _TSL_List[index].id + '#' + 'removed', true);

    console.log('移除:index=' + index + ' id=' + _TSL_List[index].id);
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
    var _TSL_List = this.data._TSL_List;

    _TSL_List[index].isOpen = !_TSL_List[index].isOpen;

    this.setData({
      _TSL_List: _TSL_List
    });
    ``
    if (_TSL_List[index].isOpen) {
      console.log('已打开:index=' + index + ' id=' + _TSL_List[index].id);
    }
    else {
      console.log('已折叠:index=' + index + ' id=' + _TSL_List[index].id);
    }
  },


  /**
   * 保存当前链所有项目
   */
  saveAll: function () {
    var _TSL_List = this.data._TSL_List;
    //var _TSL_ID = this.data._TSL_ID;
    //var _TSL_COUNT = this.data._TSL_COUNT;
    var length = _TSL_List.length;


    //保存数据
    for (var i = 0; i < length; ++i) {
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'ID', _TSL_List[i].id);
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'time', _TSL_List[i].time);
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'digest', _TSL_List[i].digest)
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'content', _TSL_List[i].content);
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'removed', _TSL_List[i].removed);
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'finished', _TSL_List[i].finished);
    }
    wx.setStorageSync(_TSL_ID + '#' + 'COUNT', length);

    console.log('已保存：' + '长度=' + length + '链ID=' + _TSL_ID);
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
    if (changed) {
      console.log('已更改');
      this.saveAll();
    }
    console.log('已隐藏');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (changed) {
      console.log('已更改');
      this.saveAll();
    }
    console.log('已卸载');
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

  },

})