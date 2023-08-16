const { Client, Reaction, MessageMedia , LocalAuth} = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const axios = require("axios")
const unit = 'Metric'
const getFBInfo = require("@xaviabot/fb-downloader")
const youtube = require("ytdownloader-fts")
const fs = require('fs')
const { Google, Musixmatch } = require("@flytri/lyrics-finder")
const {google} = require('yuomi')
const truecallerjs = require("truecallerjs")
const prefix = process.env.PREFIX
require('dotenv').config()

const client = new Client({
  authStrategy: new LocalAuth()
})

client.on("qr", (qr) => {
  qrcode.generate(qr,{ small: true });
})


client.on("ready", async () => {
  console.log("Successfully Scanned!")

  const mainNumber = process.env.OWNER_NUMBER

  const chatId = mainNumber.substring(1) + "@c.us"; 

  const textmessage = `_*Bot Is Working Now!*_\n\n*Working On _${mainNumber}_*\n\n*Thanks For Using _Zyntex_*`

  const media = await MessageMedia.fromUrl('https://i.imgur.com/dMtipdL.jpeg')

  client.sendMessage(chatId, media, {caption: textmessage });
  
  console.log(`BOT STARTED!   Prefix = '${prefix}'`)

});

// weather info fetcher

const apiKey = process.env.WEATHER_API_KEY;
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

client.on("message", async (message) => {

    if (message.body.startsWith('.weather')) {
  
      const query = message.body.slice(8).trim();
  
      const weatherUrl = apiUrl + query + "&appid=" + apiKey;
  
  
      const response = await fetch(weatherUrl);
      const data = await response.json();


       const chat = await message.getChat();

       if(!query) {
        message.react('❗')
        message.reply('```Need Query!\n\nex: .weather   <Location Name>```')
        }else{
          if (response.status == 404) {
            chat.sendStateTyping()
            message.react('❌')
            message.reply(
            "```Location Not Found!\n\n•Check spelling\n•Make sure there is such a place```");
          }else{
            chat.sendStateTyping()
            message.react('🌦️') 
            const media = await MessageMedia.fromUrl(process.env.OWNER_IMAGE_URL)

            chat.sendMessage(media, {caption:
`*Weather Info of*_*${data.name}*_
*-------------------*


‣ *Location:* ${data.name}

‣ *Temperature:* ${data.main.temp} °C

‣ *Humidity:* ${data.main.humidity} %

‣ *Wind Speed:* ${data.wind.speed} km/h

‣ *Latitude:* ${data.coord.lat}

‣ *Longitude:* ${data.coord.lon}

‣ *Pressure:* ${data.main.pressure} hPa

‣ *Min-Temp:* ${data.main.temp_min} °C

‣ *Max-Temp:* ${data.main.temp_max} °C

‣ *Unit:* ${unit}`})

          }
        }

      }
    }
  )

  client.on('message' , async(message) => {
    if(message.body.startsWith(".lyrics")){
      const lyricQuery = message.body.slice(8).trim();


      if(!lyricQuery){
        message.reply('```Please provide a song name!\n\nex: .lyrics faded```');
      }else{

        Musixmatch(lyricQuery).then((response)=>{
    

          if(response.lyrics.length == 0){
            try{
              Google(lyricQuery).then((res)=>{
                message.reply(res.lyrics)
              })
            }catch(err){
              message.reply(err)
            }
          }else{
            try{
              message.reply(response.lyrics)
            }catch(err){
              message.reply(err)
            }
          }
        })
      }
    }
  })


  // Test command

  client.on('message', message =>{
    if(message.body == prefix + 'test'){
      message.react('🔗')
      message.reply('This is a test!')
    }
  })


  client.on('message', async(message) => {
    if(message.body.startsWith('.fb')){

      const fbUrl = message.body.slice(3).trim()
      if(!fbUrl) {
        message.reply('*Need Facebook Video URLv*')
      }else{
        await message.reply('_*Please Wait! We are processing your video. This may take few seconds....*_')
        async function printFBInfo() {
        try {
            const result = await getFBInfo(
              fbUrl
            );
            const fbVidThumb = result.thumbnail

            const HDfbDlRes = result.hd

            const SDfbDlRes = result.sd

            const fbVidTitle = result.title

            const fbVidUrl = result.fbUrl

            const fbMedia = await MessageMedia.fromUrl(fbVidThumb);

            const fbChat = await message.getChat();

            fbChat.sendMessage(fbMedia, {caption: `--- _*Facebook Video Downloader*_ ---\n\n\n*Title:* ${fbVidTitle}\n\n*Url*: ${fbUrl}\n\n--- *_Click the link to download_*  ---\n\n_(Recommended Browser: Chrome\nLinks Are *100%* Safe.)_\n\n*SD Quality: ${SDfbDlRes}*\n\n*HD Quality: ${HDfbDlRes}*`})
          
        } catch (error) {
            message.reply('*An error occured!*\n' + `_*${err}*_`);
        }
    }
    
    printFBInfo();
    }}
  })

  client.on('message', async(message) =>{
    if(message.body.startsWith('.yt')){

      message.reply('_*Please Wait! We are processing your video. This may take few seconds....*_')

      const ytUrl = message.body.slice(4).trim()

      if(!ytUrl){
        message.reply('*Need YouTube Link!\n\n*```ex: .yt <Youtube link>```')
      }else{
        youtube(ytUrl).then((response) => {

          try{
            
          const ytVidTitle = response.title
          const ytVidDesc = response.description
          const ytVidGenre = response.gender
          const ytVidId = response.vid.ytVidId
          const ytVidUrl = response.vid.ul
          const ytVidDur = response.vid.duration
          const ytVidPub = response.vid.published
          const ytVidVie = response.vid.views
          const ytVidThumb = response.vid.thumbnail
          const ytVidAuthName = response.vid.author.name
          const ytVidAuthId = response.vid.author.id
          const ytVidAuthUl = response.vid.author.ul
          const ytVidAuthThumb = response.vid.author.thumbnail
          const ytVidDownAudio320 = response.download.audio[0].ul
          const ytVidDownAudio320Size = response.download.audio[0].size
          const ytVidDownAudio128 = response.download.audio[1].ul
          const ytVidDownAudio128Size = response.download.audio[1].size
          const ytVidDownVideo1ul = response.download.video[0].ul
          const ytVidDownVideo1Size = response.download.video[0].size
          const ytVidDownVideo1quality = response.download.video[0].quality
          const ytVidDownVideo2ul = response.download.video[1].ul
          const ytVidDownVideo2Size = response.download.video[1].size
          const ytVidDownVideo2Quality = response.download.video[1].quality
          
          
          message.reply(
  `_*Ｙ♢ＵＴＵＢΞ  Ｄ♢ＷＮＬ♢ΛＤΞＲ*_
  *_____________________________*
  
  
  ‣ *Title*: ${ytVidTitle}
  
  ‣ *Duration*: ${ytVidDur}
  
  ‣ *Published*: ${ytVidPub}
  
  ‣ *Views*: ${ytVidVie}
  
  ‣ *Channel*: ${ytVidAuthName}
  
  
  
  ----- *AUDIO* -----
  
  ‣ *Quality*: 320kbps
  ‣ *Size*: ${ytVidDownAudio320Size}
  
  ‣ *Download Link: ${ytVidDownAudio320}*
  
  
  ‣ *Quality*: 128kbps
  ‣ *Size*: ${ytVidDownAudio128Size}
  
  ‣ *Download Link: ${ytVidDownAudio128}*
  
  
  
  ----- *VIDEO* -----
  
  ‣ *Quality*: ${ytVidDownVideo1quality}
  ‣ *Size*: ${ytVidDownVideo1Size}
  
  ‣ *Download Link: ${ytVidDownVideo1ul}*
  
  
  
  ‣ *Quality*: ${ytVidDownVideo2Quality}
  ‣ *Size*: ${ytVidDownVideo2Size}
  
  ‣ *Download Link: ${ytVidDownVideo2ul}*`)

          }catch(err){
            message.reply('*An error occured!*\n' + `_*${err}*_`)
          }  

        })
      }

    }
  })

  client.on('message', async(message) =>{
    if(message.body.startsWith('.google')){
      const googleQuery = message.body.slice('8').trim()
      if(!googleQuery){
        await message.reply('```Need Query!\n\nex: .google <query>```')
      }else{
        try{

          google(googleQuery).then(yume => {
            const result0Titl = yume[0].title
            const result0Desc = yume[0].description
            const result0Link = yume[0].link
            
            const result1Titl = yume[1].title
            const result1Desc = yume[1].description
            const result1Link = yume[1].link
        
            const result2Titl = yume[2].title
            const result2Desc = yume[2].description
            const result2Link = yume[2].link
        
            const result3Titl = yume[3].title
            const result3Desc = yume[3].description
            const result3Link = yume[3].link
        
            const result4Titl = yume[4].title
            const result4Desc = yume[4].description
            const result4Link = yume[4].link


            message.reply(
`*Search Results For _${googleQuery}_*
____________________


*1)* *${result0Titl}*

_${result0Desc}_

${result0Link}


*2)* *${result1Titl}*

_${result1Desc}_

${result1Link}


*3)* *${result2Titl}*

_${result2Desc}_

${result2Link}


*4)* *${result3Titl}*

_${result3Desc}_

${result3Link}


*5)* *${result4Titl}*

_${result4Desc}_

${result4Link}`)
          })
          
        }catch(err){
          message.reply('*An Error Occured!*\n' + `_*${err}*_`)
        }
      }
    }
      
  })



  client.on('message', async(message) =>{
    if(message.body.startsWith('.tc')){
      const tcQueryCountry = message.body.slice(4,6).trim()
      const tcQueryNumber = message.body.slice(7).trim()


      if(!tcQueryCountry || !tcQueryNumber){
        message.reply('*An error occured!*')
      }else{
        const search_data = {
          number: tcQueryNumber,
          countryCode: tcQueryCountry,
          installationId: process.env.TRUECALLER_INSTALLATION_ID,
        };
        
        truecallerjs.search(search_data).then((res) => {

          try {

          const contactName = res.json().data[0].name
          const carrierName = res.json().data[0].phones[0].carrier
          const numberType = res.json().data[0].phones[0].numberType
          const type = res.json().data[0].phones[0].type
          const access = res.json().data[0].access
          const city = res.getAddresses(JSON)[0].city
          const countryCode = res.getAddresses(JSON)[0].countryCode
          const timeZone = res.getAddresses(JSON)[0].timeZone
          const countryName = res.getCountryDetails(JSON).name
          const native = res.getCountryDetails(JSON).native
          const continent = res.getCountryDetails(JSON).continent
          const currency = res.getCountryDetails(JSON).currency
          const langs = res.getCountryDetails(JSON).languages
          const flagUrl = res.getCountryDetails(JSON).flagURL


          message.reply(
`_*Number Information*_
________________
            
            
*Name*: ${contactName}
            
*Carrier Name*: ${carrierName}
            
*Access*: ${access}
            
*Type*: ${type}
            
*Number Type*: ${numberType}
            
*Continent*: ${continent}
            
*Country*: ${countryName}
            
*Native*: ${native}
            
*Country Code*: ${countryCode}
            
*Country Languages*: ${langs}
            
*Country Currency*: ${currency}
            
*State*: ${city}
            
*Time Zone*: ${timeZone}
            
*Country Flag Image*: ${flagUrl}`)



          }
          catch(err){
            message.reply('*An Error Occured!*\n' + `_*${err}*_`)
          }
          

          

          
        })
      }
      }
    }
  )

  client.on('message', async(message) =>{
    if(message.body == prefix + 'quote'){
        async function randomQuote() {
            const response = await fetch('https://api.quotable.io/random')
            const quote = await response.json()
            
            const qc = quote.content
            const qa = quote.author
    
            message.reply(`*${qc}*\n\n- _*${qa}*_`)
        }
        randomQuote()
    }
})

 client.on('message' , async(message) => {
  if(message.body == prefix + 'technews'){
    async function randomTechNews() {

      try{
        const newsArray = await axios.get("https://fantox001-scrappy-api.vercel.app/technews/random")
        const randomNews = newsArray.data;
  
        const news = randomNews.news
        const thumb = randomNews.thumbnail

        const chat = await message.getChat();

        const media = await MessageMedia.fromUrl(thumb)

        chat.sendMessage(media, {caption: `*${news}*`})

      }catch(err){
        message.reply('*An Error Occured!*\n' + `_*${err}*_`)
      }
    }
    
    randomTechNews();
  }
 })




client.initialize();
