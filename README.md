# Discord-Bot
Personal Discord Bot for close friend group running on Node.js on DigitalOcean cloud droplet

Only uploading commands of interest that took peculiar functionalities.

First is the Magic the gathering quick lookup so users don't have to bring examples of cards when referenced and instead simply refer to it as [[such]].
This required Cheerio web scraping on scryfall card pages.

<img width="475" alt="Screen Shot 2021-11-22 at 10 05 21 AM" src="https://user-images.githubusercontent.com/43052212/142885040-231d1009-99fd-4ffc-bd97-285500874c39.png">

Second is the reddit random post generator. It requires a subreddit picked in the code. Although changing it to feeding the desired subreddit by the user on demand wouldn't be too hard to implement. It used to be used for a specific subreddit but now depreciated. Currently set to grab a random top post of /r/Aww.
This utilized snekfetch which is now depreciated and replaced with node-fetch used by the MTG functionality above.

<img width="609" alt="Screen Shot 2021-11-22 at 10 21 35 AM" src="https://user-images.githubusercontent.com/43052212/142888376-20895ff2-78c9-4c75-a316-543c4024b778.png">
