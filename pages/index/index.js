

Page({
  onLoad(){

    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now?city=%E4%B8%8A%E6%B5%B7%E5%B8%82',
      data:{
        city:'上海市'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:res => {
        console.log(res.data)
      }
    })
  }
})
