const apiKey = "cd04ae4cec5f1b747c75eae5b3103e9f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const qrcode = require("qrcode-terminal");

const { Client, Reaction } = require("whatsapp-web.js");
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {

  if (message.body.startsWith(".")) {

    const query = message.body.slice(1).trim();

    const weatherUrl = apiUrl + query + "&appid=" + apiKey;


    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (response.status == 404) {
      const chat = await message.getChat();
      chat.sendStateTyping()
      message.react('❌')
      message.reply(
        "```Location Not Found!\n\n•Check spelling\n•Make sure there is such a place```"
	    );
    } else {
      const chat = await message.getChat();
      chat.sendStateTyping()
      message.react('🌦️')
		  message.reply( 
			  '*Weather Info of*'  + '_*' + data.name + '*_' + '\n' + '-------------------' + '\n\n' + '*Location:* '  + data.name + '\n\n' + '*Country:* ' + data.sys.country + '\n\n' + '*Temperature:* '  + data.main.temp + ' °C' + '\n\n' + '*Humidity:* ' + data.main.humidity + ' %' + '\n\n' + '*Wind Speed:* ' + data.wind.speed + ' km/h' +  '\n\n' + '*Latitude:* ' + data.coord.lat + '\n\n' + '*Longitude:* ' + data.coord.lon + `\n\n` + '*Pressure:* ' + data.main.pressure + ' hPa' + `\n\n` + '*Min-Temp:* ' + data.main.temp_min + ' °C' + `\n\n` + '*Max-Temp:* ' + data.main.temp_max + ' °C' + `\n\n\n\n\n` + '-------------------' + '```Type:\n\n!owner - To get owner info\n!contact - To get owner contact info```'
      )
    }
  }

});

client.on('message', message =>{
  if(message.body == '.'){
    message.react('❗')
    message.reply('```Need Query!\n\nex:.<Location Name>```')
  }
})

client.on('message', message =>{
  if(message.body == '!owner'){
    message.react('💁‍♂️')
    message.reply('*Hey!*\n\nMy Onwer is *Abhishek Narayan*\n\n```Type !contact to get contact info```')
  }
})

client.on('message', message =>{
  if(message.body == '!contact'){
    message.react('🔗')
    message.reply('*Contact*: 916282888139\n\n*Insta*: instagram.com/the_ferocious_kid._')
  }
})

client.initialize();