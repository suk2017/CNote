// pages/TSLPanel/TSLPanel.js

var util = require('../../utils/util.js');
var _TSL_ID = 0; //当前的时序链ID
var _TSL_COUNT = 0; //当前时序链的项目ID计数 使用它区别不同项目
var changed = false; //是否已改变 若true则需要重新保存

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '请等待...',
    addNew: false,
    removing: false,
    TSLs: [],
  },

  navigateButton: function (e) {
    if (this.data.removing) {
      this.setData({
        removing: false,
      });
      return;
    }

    var index = e.currentTarget.id;
    wx.navigateTo({
      url: '../TSL/TSL?TSL_ID=' + index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.clearStorage();
    // console.log('已清空本地存储');
    var that = this;
    wx.getStorageInfo({
      success: function (res) {
        var str = '当前使用:' + res.currentSize + 'kb' + ' 总共可用:' + res.limitSize + 'kb';
        console.log(str);
        that.setData({
          msg: str,
        });
      },
    });

    this.loadTSLs('X');
  },

  /**
   * 加载时序链
   */
  loadTSLs: function (option) {


    _TSL_ID = option.TSL_ID;
    //var _TSL_ID = option.TSL_ID;//确定要加载的是哪个时序链
    var _TSL_COUNT = 0;
    changed = false;

    _TSL_COUNT = wx.getStorageSync(_TSL_ID + '#' + 'COUNT')
    console.log('当前链ID:' + _TSL_ID);
    //console.log('初始长度:' + this.data._TSL_List.length);
    console.log('当前count:' + _TSL_COUNT);


    var objList = [];
    var time;
    var digest;
    var content;
    var step = 0;
    var count = _TSL_COUNT;
    for (var i = 0; i < count; ++i) {

      //若未被移除 则读取剩余数据
      time = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'time');
      digest = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'digest');
      content = wx.getStorageSync(_TSL_ID + '#' + i + '#' + 'content');

      //装载进入预制的对象数组
      objList.push({
        id: step, //重设id
        time: time,
        digest: digest,
        content: content,
      })
      ++step;
    }

    //更新数据
    this.setData({
      TSLs: objList,
    });


    console.log('当前加载TSL:id=' + _TSL_ID + ' count=' + _TSL_COUNT);


  },

  goToTomato: function () {
    wx.navigateTo({
      url: '../Tomato/Tomato',
    })
  },

  /**
   * 创建一个时序链
   */
  addNewTSLItem: function () {
    this.setData({
      addNew: !this.data.addNew
    });
  },

  /**
   * 保存这个时序链
   */
  inputNewTSLItem: function (e) {
    var str = e.detail.value;
    var _TSL_List = this.data.TSLs;
    var _TSL_ID = this.data._TSL_ID;

    //若新值无意义则舍去 同时会取消编辑框
    if (str == undefined || str.length == 0) {
      console.log('未添加');
    } else {
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
        id: _TSL_List.length, //id和index相反
        time: util.formatTime(new Date()),
        //digest: digest,
        content: str,
        //isOpen: false, //项目是否进入详情状态
        //removed: false, //项目是否被移除
        //editable: false, //时序链中的项目是否处在编辑状态
        //finished: '', //项目是否已经完成
        //finishedImage: 'finish', //项目完成所使用的图片
      });
      console.log('已添加:\'' + _TSL_List[0].content + '\'' + ' id:' + _TSL_List[0].id);
    }

    //更新数据
    this.setData({
      TSLs: _TSL_List,
      addNew: false,
    })
    changed = true;
    console.log('3');

this.saveTSLs();
    
  },

  saveTSLs:function(){
    //存储数据
    var _TSL_List = this.data.TSLs
    var length = _TSL_List.length;
    for (var i = 0; i < length; ++i) {
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'ID', _TSL_List[i].id);
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'time', _TSL_List[i].time);
      //wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'digest', _TSL_List[i].digest)
      wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'content', _TSL_List[i].content);
      //wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'removed', _TSL_List[i].removed);
      //wx.setStorageSync(_TSL_ID + '#' + i + '#' + 'finished', _TSL_List[i].finished);
    }
    wx.setStorageSync(_TSL_ID + '#' + 'COUNT', length);

    console.log('已保存：' + '长度=' + length + ' 链ID=' + _TSL_ID);
  },

  /**
   * 长按删除
   */
  longTapDelete: function (e) {
    var that = this;

    this.setData({
      removing: true
    });
    
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          var removingID = e.currentTarget.id;
          console.log('已确定删除' + removingID);
          
          var objList = [];
          var time;
          var digest;
          var content;
          var step = 0;
          var count = _TSL_COUNT;
          var i=0;
          for (; i < removingID; ++i) {

            //若未被移除 则读取剩余数据
            time = this.data.TSLs[i].time;
            digest = this.data.TSLs[i].digest;
            content = this.data.TSLs[i].content;

            //装载进入预制的对象数组
            objList.push({
              id: step, //重设id
              time: time,
              digest: digest,
              content: content,
            })
            ++step;
          }
          ++i;
          for (; i < count; ++i) {

            //若未被移除 则读取剩余数据
            time = this.data.TSLs[i].time;
            digest = this.data.TSLs[i].digest;
            content = this.data.TSLs[i].content;

            //装载进入预制的对象数组
            objList.push({
              id: step, //重设id
              time: time,
              digest: digest,
              content: content,
            })
            ++step;
          };
          //更新数据
          that.setData({
            TSLs: objList,
            addNew: false,
          });

          that.saveTSLs();

        } else {//这里是点击了取消以后
          console.log('已取消删除')
        }
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