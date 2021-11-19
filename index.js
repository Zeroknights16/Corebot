if (process.platform !== "win32") require("child_process").exec("npm install n && n lts");
if (+process.version.slice(1).split('.')[0] < 12) {
  console.log("\u001b[31mCorebot requires Node JS version 12 or higher. Please go to https://nodejs.org/en/ then download and install the LTS version.\033[0m")
  process.exit()
}

const config = require("./config.json")
Parser = require("rss-parser")
parser = new Parser(),
Youtube = require("simple-youtube-api")
youtube = new Youtube(config.youtubeKey);
const installModules = async () => {
  return new Promise(async (resolve, reject) => {
    if (process.argv.slice(2).map(a => a.toLowerCase()).includes("--no-install")) resolve();
    else {
      const showInfo = process.argv.slice(2).map(a => a.toLowerCase()).includes("--show-install-output");
      const start = Date.now();

      const { spawn } = require('child_process');

      const npmCmd = process.platform == "win32" ? 'npm.cmd' : 'npm';

      const modules = Object.keys(require('./package.json').dependencies);

      const info = "[90m>[39m          [38;2;87;255;107m[1m[INFO][22m[39m";

      const missingModules = modules.filter(module => {
        try {
          require.resolve(module);
          return;
        } catch (err) {
          return module !== "n";
        }
      });

      if (missingModules.length == 0) {
        console.log(info, 'No modules are missing... Bot is starting up');
        resolve();
      } else {
        console.log(info, missingModules.length, `module${missingModules.length == 1 ? ' is' : 's are'} not installed... Installing...`);

        for (let i = 0; i < missingModules.length; i++) {
          const module = missingModules[i];

          console.log(info, `Installing module ${i + 1}/${missingModules.length} (${module})`);

          await new Promise(resolve => {
            const install = spawn(npmCmd, ['i', module]);

            install.stdout.on('data', (data) => {
              if (showInfo) console.log(data.toString().trim())
            })

            install.stderr.on('data', (data) => {
              if (showInfo) console.log("\u001b[31m" + data.toString().trim());
            })

            install.on('exit', () => {
              console.log(info, `Finished installing module ${i + 1}/${missingModules.length} (${((i + 1) / missingModules.length * 100).toFixed(2)}% done)`);
              resolve();
            })
          })
        }

        console.log(info, 'All missing modules have been installed... Bot is starting up');
        resolve();
      }

      // // Run install scripts
      // Promise.all([install, installSqlite]
      //   .map((cmd, i) => {
      //     return new Promise(resolve => {
      //       console.log("Running '" + commands[i] + "' command.")
      //       cmd.stdout.on('data', (data) => {
      //         console.log(data.toString().trim())
      //       })

      //       cmd.stderr.on('data', (data) => {
      //         console.log("\u001b[31m" + data.toString().trim());
      //       })

      //       cmd.on('exit', () => {
      //         resolve();
      //       })
      //     })
      //   }))
      //   .then(() => {
      //     // After all scripts have exited

      //     console.log('Took', Date.now() - start, 'ms');
      //     resolve();
      //   })
    }
  })
}
installModules().then(async () => {
  require('console-stamp')(console, { label: false, pattern: 'HH:MM:ss', colors: { stamp: 'gray' } })
  const Utils = require('./modules/utils.js');
  const variables = Utils.variables;

  let config;
  let lang;
  let commands;
  let embeds;
  let TLDs;

  try {
    config = await Utils.yml('./config.yml');
    lang = await Utils.yml('./lang.yml');
    commands = await Utils.yml('./commands.yml')
    embeds = await Utils.yml('./embeds.yml')
    TLDs = await Utils.yml('./TLDs.yml');
  } catch (e) {
    if (['YAMLSemanticError', 'YAMLSyntaxError'].includes(e.name)) console.log(Utils.errorPrefix + "An error has occured while loading the config or lang file. Bot shutting down..." + Utils.color.Reset)
    else console.log(e);

    return process.exit();
  }

  variables.set('config', config);
  variables.set('lang', lang);
  variables.set('commands', commands)
  variables.set('embeds', embeds)
  variables.set('TLDs', TLDs);
  variables.set('tempChannels', new Map())

  // DATABASE
  const Database = await require('./modules/database.js').setup(config);

  // Set variables
  variables.set('usersInVoiceChannel', []);
  variables.set('errors', []);
  variables.set('db', Database)

  const Discord = require("discord.js");
  const fs = require('fs');

  const Embed = require('./modules/embed.js');
  const bot = new Discord.Client({ autoReconnect: true });

  variables.set('bot', bot);

  // COMMAND HANDLER
  const CommandHandler = require('./modules/handlers/CommandHandler').init();

  // EVENT HANDLER
  const EventHandler = require('./modules/handlers/EventHandler').init(bot);

  const error = require('./modules/error');
  process.on('uncaughtException', (err) => {
    return;
  })

  const { inspect } = require("util");
  process.on('unhandledRejection', async function (reason, promise) {
    const promiseText = inspect(promise) || "";
    try {
      error(reason.toString(), promiseText, !!promiseText ? promiseText.split("\n")[2].split(" ")[8].split(/\/|\\/).pop().replace(/\)|\(/g, '') : "Unknown");
    } catch (err) {
      error(reason.toString(), "Unknown", promiseText);
    }
  })

  Utils.yml('./config.yml')
    .then(config => {
      bot.login(config.Token).catch(error => {
        console.log(Utils.errorPrefix + "Your bot token is incorrect! Shutting down...")
        process.exit()
      })
      variables.set('bot', bot);
    })


  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    if (input == 'stop') {
      console.log('Bot shutting down...');
      process.exit();
    }
  });


  const startAt = Date.now();
  const lastVideos = {};

  client.on("ready", () => {
    console.log(`[!] Ready to listen ${config.youtubers.length} youtubers!`);
    check();
    setInterval(check, 20*1000);
});
/**
 * Format a date to a readable string
 * @param {Date} date The date to format 
 */
 function formatDate(date) {
  let monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  let day = date.getDate(), month = date.getMonth(), year = date.getFullYear();
  return `${day} ${monthNames[parseInt(month, 10)]} ${year}`;
}

/**
* Call a rss url to get the last video of a youtuber
* @param {string} youtubeChannelName The name of the youtube channel
* @param {string} rssURL The rss url to call to get the videos of the youtuber
* @returns The last video of the youtuber
*/
async function getLastVideo(youtubeChannelName, rssURL){
  console.log(`[${youtubeChannelName}]  | Getting videos...`);
  let content = await parser.parseURL(rssURL);
  console.log(`[${youtubeChannelName}]  | ${content.items.length} videos found`);
  let tLastVideos = content.items.sort((a, b) => {
      let aPubDate = new Date(a.pubDate || 0).getTime();
      let bPubDate = new Date(b.pubDate || 0).getTime();
      return bPubDate - aPubDate;
  });
  console.log(`[${youtubeChannelName}]  | The last video is "${tLastVideos[0] ? tLastVideos[0].title : "err"}"`);
  return tLastVideos[0];
}

/**
* Check if there is a new video from the youtube channel
* @param {string} youtubeChannelName The name of the youtube channel to check
* @param {string} rssURL The rss url to call to get the videos of the youtuber
* @returns The video || null
*/
async function checkVideos(youtubeChannelName, rssURL){
  console.log(`[${youtubeChannelName}] | Get the last video..`);
  let lastVideo = await getLastVideo(youtubeChannelName, rssURL);
  // If there isn't any video in the youtube channel, return
  if(!lastVideo) return console.log("[ERR] | No video found for "+lastVideo);
  // If the date of the last uploaded video is older than the date of the bot starts, return 
  if(new Date(lastVideo.pubDate).getTime() < startAt) return console.log(`[${youtubeChannelName}] | Last video was uploaded before the bot starts`);
  let lastSavedVideo = lastVideos[youtubeChannelName];
  // If the last video is the same as the last saved, return
  if(lastSavedVideo && (lastSavedVideo.id === lastVideo.id)) return console.log(`[${youtubeChannelName}] | Last video is the same as the last saved`);
  return lastVideo;
}

/**
* Get the youtube channel id from an url
* @param {string} url The URL of the youtube channel
* @returns The channel ID || null
*/
function getYoutubeChannelIdFromURL(url) {
  let id = null;
  url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
  if(url[2]) {
    id = url[2].split(/[^0-9a-z_-]/i)[0];
  }
  return id;
}

/**
* Get infos for a youtube channel
* @param {string} name The name of the youtube channel or an url
* @returns The channel info || null
*/
async function getYoutubeChannelInfos(name){
  console.log(`[${name.length >= 10 ? name.slice(0, 10)+"..." : name}] | Resolving channel infos...`);
  let channel = null;
  /* Try to search by ID */
  let id = getYoutubeChannelIdFromURL(name);
  if(id){
      channel = await youtube.getChannelByID(id);
  }
  if(!channel){
      /* Try to search by name */
      let channels = await youtube.searchChannels(name);
      if(channels.length > 0){
          channel = channels[0];
      }
  }
  console.log(`[${name.length >= 10 ? name.slice(0, 10)+"..." : name}] | Title of the resolved channel: ${channel.raw ? channel.raw.snippet.title : "err"}`);
  return channel;
}

/**
* Check for new videos
*/
async function check(){
  console.log("Checking...");
  config.youtubers.forEach(async (youtuber) => {
      console.log(`[${youtuber.length >= 10 ? youtuber.slice(0, 10)+"..." : youtuber}] | Start checking...`);
      let channelInfos = await getYoutubeChannelInfos(youtuber);
      if(!channelInfos) return console.log("[ERR] | Invalid youtuber provided: "+youtuber);
      let video = await checkVideos(channelInfos.raw.snippet.title, "https://www.youtube.com/feeds/videos.xml?channel_id="+channelInfos.id);
      if(!video) return console.log(`[${channelInfos.raw.snippet.title}] | No notification`);
      let channel = client.channels.get(config.channel);
      if(!channel) return console.log("[ERR] | Channel not found");
      channel.send(
          config.message
          .replace("{videoURL}", video.link)
          .replace("{videoAuthorName}", video.author)
          .replace("{videoTitle}", video.title)
          .replace("{videoPubDate}", formatDate(new Date(video.pubDate)))
      );
      console.log("Notification sent !");
      lastVideos[channelInfos.raw.snippet.title] = video;
  });
}


  if (Utils.getStartupParameters().includes("clear-errors")) {
    if (fs.existsSync("./errors.txt")) {
      fs.unlink("./errors.txt", (err) => {
        if (err) console.log(err);
        else {
          console.log(Utils.infoPrefix + 'Cleared errors.txt');
        }
      })
    }
  }

  if (Utils.getStartupParameters().includes("clear-backups")) {
    if (fs.existsSync("./backup")) {
      const backups = fs.readdirSync("./backup");

      backups.forEach(backup => {
        fs.rmdirSync(`./backup/${backup}`, {
          recursive: true
        });
      });

      console.log(Utils.infoPrefix + 'Cleared backups');
    }
  }


});
// 203265   8501   CE__%%    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469