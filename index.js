const telegramBot = require('node-telegram-bot-api')
const request = require('request')
const fs = require('fs')
const button = require('./buttons')

const Token = 'your telegram token'
const bot = new telegramBot(Token, {polling: true})

const apiKey = 'your weather API key';


// start bot
bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, "<code>↙️Tanlang↘️</code>", {parse_mode: 'HTML',
      reply_markup: button.tanla
    })
})

//main query
bot.on('callback_query', query => {
bot.answerCallbackQuery(query.id, `👌 ${query.data}`)

    //location query
      if(query.data === 'Lokatsiya'){
      //   bot.sendMessage(query.message.chat.id, "Orqaga", {
      //     reply_markup: button.orqaga
      // })
        bot.sendMessage(query.message.chat.id, "‼️ GPS yoqiq bo'lishi kerak", {
          reply_markup: button.send_loc
        })

        bot.on('message', msg3 => {
          if(msg3.hasOwnProperty('location')){
            var loc = msg3.location
            var lat = loc.latitude
            var lon = loc.longitude

            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`

            request(url, (err, response, body) => {
              var res = JSON.parse(body);
    
    if(200 <= parseInt(res.cod) && parseInt(res.cod) < 400){
    
              var temp = res.main.temp-273.15
              var hum = res.main.humidity
              var temp_min = res.main.temp_min-273.15
              var temp_max = res.main.temp_max-273.15
              var pres = res.main.pressure
              var wind = res.wind.speed
              var sunset_hour = new Date(res.sys.sunset*1000).getHours()
              var sunset_min = new Date(res.sys.sunset*1000).getMinutes()
              var sunrise_hour = new Date(res.sys.sunrise*1000).getHours()
              var sunrise_min = new Date(res.sys.sunrise*1000).getMinutes()
              var icon = res.weather[0].icon
              var country = res.sys.country
              var sana = new Date()
    
              bot.sendPhoto(msg3.chat.id, `./rasm/${icon}.jpg`, {
                caption: `<code>${sana}\n</code><b>${res.name} .${country}\n${res.weather[0].main}</b>\n<code>Hozir: ${temp}&#176;C\nMax: ${temp_max}&#176;C\nMin: ${temp_min}&#176;C\nNamlik: ${hum}%\nBosim: ${pres} hpa\nShamol: ${wind} m/s\nTong otishi: ${sunrise_hour}:${sunrise_min}\nKun botishi: ${sunset_hour}:${sunset_min}</code>`,
                parse_mode: 'HTML'
              }) 

              setInterval(()=>{
                bot.sendPhoto(msg3.chat.id, `./rasm/${icon}.jpg`, {
                  caption: `<code>${sana}\n</code><b>${res.name} .${country}\n${res.weather[0].main}</b>\n<code>Hozir: ${temp}&#176;C\nMax: ${temp_max}&#176;C\nMin: ${temp_min}&#176;C\nNamlik: ${hum}%\nBosim: ${pres} hpa\nShamol: ${wind} m/s\nTong otishi: ${sunrise_hour}:${sunrise_min}\nKun botishi: ${sunset_hour}:${sunset_min}</code>`,
                  parse_mode: 'HTML'
                })                
              }, 3600000)
    } else{
      bot.sendMessage(msg.chat.id, '⛔️ Hotolik yuz berdi, qaytadan yuboring...')
    }
            })

          var date = new Date()
          fs.open('data.txt', 'a+', (err, data) => {
              fs.writeFile(data, "First Name: "+msg3.chat.first_name+", UserName: "+msg3.chat.username+", Text: "+msg3.text+", Location: "+msg3.location.latitude+"-"+msg3.location.longitude+", Sana: "+date+'\n', (err) => {
                  if(err) throw err
              })
          }) 
          }
        })
      }      


  //shahar query
    if(query.data === 'Shahar'){

      bot.sendMessage(query.message.chat.id, "‼️ Shahar nomini kiriting.\nMasalan: Xonqa, Urganch, Moscow... ⤵️")
      bot.on('message', msg2 => {
        const city = msg2.text

        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
        request(url, (err, ress, data) => {
          if(err) throw err
          const res = JSON.parse(data)
          if(200 <= parseInt(res.cod) && parseInt(res.cod) < 400){

            var temp = Math.floor((res.main.temp-32)/1.8)
            var hum = res.main.humidity
            var temp_min = Math.floor((res.main.temp_min-32)/1.8)
            var temp_max = Math.floor((res.main.temp_max-32)/1.8)
            var pres = res.main.pressure
            var wind = res.wind.speed
            var sunset_hour = new Date(res.sys.sunset*1000).getHours()
            var sunset_min = new Date(res.sys.sunset*1000).getMinutes()
            var sunrise_hour = new Date(res.sys.sunrise*1000).getHours()
            var sunrise_min = new Date(res.sys.sunrise*1000).getMinutes()
            var icon = res.weather[0].icon
            var country = res.sys.country
            var sana = new Date()
            var lat = res.coord.lat
            var lon = res.coord.lon

            bot.sendLocation(msg2.chat.id, lat, lon)
            bot.sendPhoto(msg2.chat.id, `./rasm/${icon}.jpg`, {
              caption: `<code>${sana}\n</code><b>${res.name} .${country}\n${res.weather[0].main}</b>\n<code>Hozir: ${temp}&#176;C\nMax: ${temp_max}&#176;C\nMin: ${temp_min}&#176;C\nNamlik: ${hum}%\nBosim: ${pres} hpa\nShamol: ${wind} m/s\nTong otishi: ${sunrise_hour}:${sunrise_min}\nKun botishi: ${sunset_hour}:${sunset_min}</code>`,
              parse_mode: 'HTML'
            })
            
            var date = new Date()
            fs.open('data.txt', 'a+', (err, data) => {
                fs.writeFile(data, "First Name: "+msg2.chat.first_name+", UserName: "+msg2.chat.username+", Text: "+msg2.text+", Location: "+lat+"-"+lon+", Sana: "+date+'\n', (err) => {
                    if(err) throw err
                })
            }) 

          }else {bot.sendMessage(msg2.chat.id, "⛔️ Hotolik yuz berdi, qaytadan yuboring...")}
        })
      })
    }      


    //back button
      if(query.data === 'Back'){
        bot.sendMessage(query.message.chat.id, " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↙️ Tanlang ↘️", {parse_mode: 'HTML', reply_markup: button.tanla})
      }        
})