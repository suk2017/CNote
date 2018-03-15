// pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    BookArray: [
      { id: 0, status: 0, name: '读书的趣味', time: '2017-5-3', text: '人的灵魂是用文字雕刻出来的，所以阅读意味着灵魂的成长。——段伟', img_url: '../../image/03.jpg', like: true, favorite: false },
      { id: 1, status: 0, name: '书山有路勤为径', time: '2017-5-8', text: '阅读意味着灵魂的成长，因为人的灵魂是用文字雕刻出来的', img_url: '../../image/02.jpg', like: false, favorite: true },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
        for (i = bookIndex[0].last; i < 500; ++i) {
          if (str[i] == 's' &&
            str[i + 1] == 'r' &&
            str[i + 2] == 'c'
          ) {
            for (j = i + 7; j < 500; ++j) {
              if (str[j] == '"') {
                console.log(str[j - 2] + str[j - 1] + str[j + 1] + str[j + 2]);
                break;
              }
              content += str[j];
            }
            break;
          }
        }
        this.data.BookArray[0].img_url = content;
        this.setData({ BookArray: this.data.BookArray });

        // for (i = 0; i < Count; ++i) {
        //   var content = '';
        //   for (j = bookIndex[i].last; j < bookIndex[i + 1].first; ++j) {
        //     if (str[j] == '&' && str[j + 1] == '#' && str[j + 2] == 'x') {
        //       content += '\\u' + str[j + 3] + str[j + 4] + str[j + 5] + str[j + 6];
        //       console.log('找到一字');
        //     }
        //   }
        //   console.log(uc.toChinese(content));
        // }

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

  },


  click_like: function (e) {
    var index = e.currentTarget.id

    if (this.data.BookArray[index].like == true) {
      wx.showToast({
        title: '取消点赞',
        icon: 'success',
        duration: 2000
      })
      this.data.BookArray[index].like = false
      this.setData({ BookArray: this.data.BookArray })
    }
    else {
      wx.showToast({
        title: '已点赞',
        icon: 'success',
        duration: 2000
      })
      this.data.BookArray[index].like = !this.data.BookArray[index].like
      this.setData({ BookArray: this.data.BookArray })
    }
  },



  click_favorite: function (e) {
    var index = e.currentTarget.id

    if (this.data.BookArray[index].favorite == true) {
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        duration: 2000
      })
      this.data.BookArray[index].favorite = false
      this.setData({ BookArray: this.data.BookArray })
    }
    else {
      wx.showToast({
        title: '已收藏',
        icon: 'success',
        duration: 2000
      })
      this.data.BookArray[index].favorite = true
      this.setData({ BookArray: this.data.BookArray })


    }
  },
})