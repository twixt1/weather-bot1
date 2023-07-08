const qrcode = require("qrcode-terminal")
const axios = require("axios")
const { Client, Reaction, MessageMedia , LocalAuth} = require("@juzi/whatsapp-web.js")
const prefix = '.'
const secPrefix = '!'
const unit = 'Metric'
const getFBInfo = require("@xaviabot/fb-downloader")
const youtube = require("ytdownloader-fts")
const fs = require('fs')
const { Google, Musixmatch } = require("@flytri/lyrics-finder")



const client = new Client()




client.on("qr", (qr) => {
  qrcode.generate(qr,{ small: true });
});

client.on("ready", async () => {
  console.log("Successesfully Scanned!");
});


// weather info fetcher

const apiKey = "cd04ae4cec5f1b747c75eae5b3103e9f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

client.on("message", async (message) => {

    if (message.body.startsWith('.weather')) {
  
      const query = message.body.slice(8).trim();
  
      const weatherUrl = apiUrl + query + "&appid=" + apiKey;
  
  
      const response = await fetch(weatherUrl);
      const data = await response.json();


       const chat = await message.getChat();

       if(!query) {
        message.react('❗')
        message.reply('```Need Query!\n\nex: .<Location Name>```')
        }
  
      if (response.status == 404) {
        chat.sendStateTyping()
        message.react('❌')
        message.reply(
          "```Location Not Found!\n\n•Check spelling\n•Make sure there is such a place```"
        );
      } else {
        chat.sendStateTyping()
        message.react('🌦️')

        const media = await MessageMedia.fromUrl('https://i.imgur.com/dMtipdL.jpeg')

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

  });
  

  // aditional commands

  
  client.on('message', message =>{
    if(message.body == secPrefix + 'owner'){
      message.react('💁‍♂️')
      message.reply('*Hey!*\n\nMy Onwer is *Abhishek Narayan*\n\n```Type !contact to get contact info```')
    }

    if(message.body == secPrefix + 'ping'){
      message.react('')
      message.reply('```Pong\n\nLatency = undefined```')
    }


  })
  
  client.on('message', message =>{
    if(message.body == secPrefix + 'contact'){
      message.react('🔗')
      message.reply('*Contact*: 916282888139\n\n*Insta*: instagram.com/the_ferocious_kid._')
    }
  })


  client.on('message' , async (message) => {
    if(message.body.startsWith(".lyrics")){
      const lyricQuery = message.body.slice(8).trim();

      Musixmatch(lyricQuery).then((response)=>{
        message.reply(response.lyrics)
      })

      if(!lyricQuery){
        message.reply('```Please provide a song name!\n\nex: .lyrics faded```');
      }

    }
  })


  // Test command

  client.on('message', message =>{
    if(message.body == secPrefix + 'test'){
      message.react('🔗')
      message.reply('This is a test!')
    }
  })


  // Random Quote generator

  client.on('message', async(message) =>{
    if(message.body == '.quote'){
      const quoteResponse = await fetch('https://api.quotable.io/random')
      const quote = await quoteResponse.json()

      message.reply(`${quote.content}` + '\n\n' + `-${quote.author}`)
    }
  })

  client.on('message', async(message) => {
    if(message.body.startsWith('.fb')){

      message.reply('_*Please Wait! We are processing your video. This may take few seconds....*_')

      const fbUrl = message.body.slice(3).trim()
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

            if(!fbUrl) {
              message.reply('_*Check Your URL*_')
            }
        } catch (error) {
            message.reply("Error:", error);
        }
    }
    
    printFBInfo();
    }
  })

  client.on('message', async(message) =>{
    if(message.body.startsWith('.yt')){

      message.reply('_*Please Wait! We are processing your video. This may take few seconds....*_')

      const ytUrl = message.body.slice(4).trim()

      youtube(ytUrl).then((response) => {


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



------ *AUDIO* -----

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








      })

    }
  })






client.initialize();
