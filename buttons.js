module.exports = {
tanla: {
    inline_keyboard: [
      [
        {
          text: '📡 Location orqali aniqlash',
          callback_data: 'Lokatsiya'
        },
        {
          text: '🌆 Shahar nomi orqali aniqlash',
          callback_data: 'Shahar'
        }
      ]
    ]
  },
orqaga: {
    inline_keyboard: [
      [
        {text: '⬅️ Orqaga', callback_data: 'Back'}
      ]
    ]
  },
send_loc:{
    keyboard: [
      [
        {text: '📡 Location yuborish', request_location: true}
      ]
    ],
    remove_keyboard: true
  }
}