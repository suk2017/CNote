//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    img_url: 'http://www.baidu.com/img/baidu_jgylogo3.gif',
    book_name: '资本论',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindViewTap2: function () {
    wx.navigateTo({
      url: '../TSL/TSL'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  netTest: function () {
    var that = this;
    console.log('开始');
    wx.request({

      url: 'https://detail.tmall.com/item.htm?id=557059801953',
      type: 'get',
      dataType: 'jsonp',
      data: {
      },
      success: function (data) {
        console.log('成功');

        //初始化
        var uc = require('../../utils/UnicodeConvert.js');
        var str = data.data;
        var i;
        var j;
        var index = 0;
        var Count = 20;
        var target = 'J_ImgBooth';
        var len = target.length;
        var flag = false;

        var bookIndex = new Array(Count + 1);
        for (i = 0; i < Count + 1; ++i) {
          bookIndex[i] = { first: 0, last: 7 };
        }

        //寻找关键位置
        //J_ImgBooth
        for (i = 0; i < str.length - (len - 1); ++i) {
          flag = false;
          for (j = 0; j < len; ++j) {
            if (str[i + j] != target[j]) {
              flag = true;
              break;
            }
          }
          if (flag == true) {
            continue;
          }
          else {
            console.log('发现一项');
            bookIndex[index].first = i;
            bookIndex[index].last = i + len - 1;
            ++index;
          }
        }
        bookIndex[Count].first = bookIndex[Count - 1].last + 1700;//为了防止下面循环溢出

        //提取内容
        var content = 'http://';
        for (i = bookIndex[0].last; i < bookIndex[0].last + 500; ++i) {
          if (str[i] == 's' &&
            str[i + 1] == 'r' &&
            str[i + 2] == 'c'
          ) {
            console.log('找到一个');
            for (j = i + 7; j < i + 7 + 500; ++j) {
              if (str[j] == 'j' &&
                str[j + 1] == 'p' &&
                str[j + 2] == 'g'
              ) {
                content += 'jpg';
                break;
              }
              content += str[j];
            }
            break;
          }
        }
        console.log(content);
        that.setData({ img_url: content });

        //定位
        for (i = 0; i < str.length - (len - 1); ++i) {
          if (str[i] == '产' &&
            str[i + 1] == '品' &&
            str[i + 2] == '名' &&
            str[i + 3] == '称') {
            //提取
            var bName = '';
            for (j = i + 5; j < i + 50 + 5; ++j) {
              if (str[j] == '<') {
                break;
              }
              bName += str[j];
            }
            console.log(bName);
            that.setData({book_name:bName});
          }
        }
      }
    })
  },


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  showRecommend:function(){
wx.navigateTo({
  url: '../recommend/recommend',
})
  }
})
