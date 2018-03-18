// pages/TSLPanel/TSLPanel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TSLs: [
      {
        time: '2018/3/16 16:00:00',//时间
        title: '每日事项',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 15:00:00',//时间
        title: 'CNote开发手记',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '爱情智慧',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '中华客栈人物关系进度',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '要做的事',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '科学做爱时间',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '她的月经周期',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '月经期男生要做的事情',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '备孕',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '跑跑卡丁车赛车排名',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '每日阅读任务',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '我吃过的水果',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '大学课程成绩',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '遗精记录',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '班委叫什么',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '人体按摩合集',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '儒释道智慧思考',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '永远不要做的事情',
        describe: '每天做的事情',
      },
      {
        time: '2018/3/16 14:00:00',//时间
        title: '月亮的别名',
        describe: '每天做的事情',
      },
    ],
    msg: '请等待...',
  },

  navigateButton: function (e) {
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
        var str = '当前使用:' + res.currentSize + 'kb' + '总共可用:' + res.limitSize + 'kb';
        console.log(str);
        that.setData({
          msg: str,
        });
      },
    });
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