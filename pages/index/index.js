const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')


const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({

  data:{
    weather:'',
    temp:'',
    weatherBackground:'',
    hourlyWeather: [],
    todayTime:'',
    todayTemp:'',
    city:'上海市',
    tapTip:'点击查看当前位置'
  },
  onPullDownRefresh(){
    this.getData(()=>{
      wx.stopPullDownRefresh()
    })
  },
  getData(callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        let result = res.data.result
        this.getNowData(result)
        this.getHourlyData(result)
        this.setToday(result)

      },
      complete: ()=>{
        callBack && callBack()
    
      }

    
    })
  },
  getNowData(result){
    let weahter1 = result.now.weather
    let temp2 = result.now.temp
    console.log(weahter1, temp2)
    this.setData({
      weather: weatherMap[weahter1],
      temp: temp2 + '*',
      weatherBackground: '/images/' + weahter1 + '-bg.png'
    })

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weahter1],
    })
  },
  getHourlyData(result){
    let forecast = result.forecast
    let hourlyWeather = []
    let hours = new Date().getHours()
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i * 3 + hours) % 24 + "时",
        path: "/images/" + forecast[i].weather + "-icon.png",
        temp: forecast[i].temp

      })
    }
    hourlyWeather[0].time = "现在"
    this.setData({ hourlyWeather: hourlyWeather })
  },
  setToday(result){
    let date =  new Date();
    this.setData({
      todayTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`,
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`
    })

  },
  toTodayDetail(){
      wx.navigateTo({
        url: '/pages/list/list?city='+this.data.city
      })
  },
  getLocation(){
     wx.getLocation({
       success: res => {
         console.log(res.latitude,res.longitude)
         this.qqmapsdk.reverseGeocoder({
           location: {
             latitude: res.latitude,
             longitude: res.longitude
           },
           success: res => {
             let city = res.result.address_component.city
             console.log(city)
             this.setData({
               city:city,
               tapTip:""
             })
             this.getData()
           }
         })
       },
     })
  },
  onLoad(){
    this.getData()
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    })
    
  }
})
