const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const subreddit = 'aww';// Change this for a different subreddit

module.exports = {
  name: 'reddit',
  description: "Random top images from a subreddit. Currently from /r/" + `${subreddit}`,
  async execute(message, args) {

    // Get random reddit image, snekfetch depreciated
    // Modified working code of https://pastebin.com/1NziEPyW
    const URL = 'https://www.reddit.com/r/' + `${subreddit}` + 'AnimeGirls/top/.json?t=all';
    // Web scraper
    const { body } = await snekfetch
        .get(URL)
        .query({ limit: 200 });
    const allowed = body.data.children;
    // Get random post
    const randomnumber = Math.floor(Math.random() * allowed.length)
    // Embed with certain key info
    const embed = new Discord.MessageEmbed()
    .setColor(0x00A2E8)
    .setTitle(allowed[randomnumber].data.title)
    .setDescription("Posted by: " + allowed[randomnumber].data.author)
    .setImage(allowed[randomnumber].data.url)
    .addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
    .setFooter("Post provided by r/" + `${subreddit}`)
    message.channel.send(embed)
  }
}
