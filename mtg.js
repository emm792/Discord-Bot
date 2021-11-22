module.exports = {
  name: 'mtg',
  description: "this is the Magic the Gathering card quick card preview command.",
  execute(message, args) {
    // Concatenate arguments without space, comma, period, or apostraphe. And then lower case it
    // dashes are okay as theyre essentially whitespace
    let card = args.replace(/[\s ,.`']/g , "").toLowerCase();

    // Now lets get card info from url below
    const url = 'https://magiccards.info/query?q=!'+`${card}`;

    // Using scraping from https://geekflare.com/web-scraping-in-javascript/
    const cheerio = require('cheerio');
    const fetch = require("node-fetch");

    // function to get the raw data
    const getRawData = (URL) => {
       return fetch(URL)
          .then((response) => response.text())
          .then((data) => {
             return data;
          });
    };

    // start of the program
    const scrape = async () => {

       // get card page
       let rawData = await getRawData(url);
       // parsing the data
       let $ = cheerio.load(rawData);

       // extracting name
       const name = $("span.card-text-card-name")[0].children[0].data;

       // extracting image
       const imgTable = $("div.card-image-front")[0].children[1];
       const img = $(imgTable).attr('src');
       message.channel.send(img);

       // extracting cost
       // we arent grabbing cheapest, theres multiple in "random" order
       // make sure its also correct table and not oversized or display
       const costTable = $("a.prints");

       var tables = $("div.prints").find("table");

       // iterate through tables
       for (var i = 0; i < tables.length; i++) {

         // cheapest card version for minimum comparison
         var cheapestCost = null;

         var current = tables[i];
         // get table data
         var table = $(current).children("tbody").children("tr");

         // iterate through table rows
         for (var j = 0; j < table.length; j++) {
           var row = table[j];
           // card name type
           var type = $($(row).children("td").children("a")[0]).text();
           // card cost
           var costsData = $($(row).children("td").children("a")[1]).attr('title');

           // make sure we have data to publish
           if (type != null && costsData != null) {
             // If so, lets skip the non desireables
             if (type.includes('Oversized') || type.includes('oversized') ||
                type.includes('Display') || type.includes('display')) {
               // by doing nothing
             } else {
               // and otherwise we will show results of our search
               // but first we need some extra steps
               // We need to grab the cheaper cost in costsData, as theres usually non-foil, foil, etc
               // Put all tokens into list
               var costsArray = costsData.split(" ");
               // Get rid of words
               var costs = costsArray.filter(token => token.includes('$'));
               var costsNo$ = costs.map(x => x.replace(/[$\s ,`']/g , ""));
               var costsFloat = costsNo$.map(Number);
               var cost = Math.min(...costsFloat);
               // Now we compare to global cost
               if (cost < cheapestCost || cheapestCost == null) {
                 cheapestCost = cost;
               }
             }
           }
         }
       }

       // Last result, our cheapest card cost found
       if (cheapestCost != null) {
         message.channel.send("TCGplayer NM market price of " + `${name}` + " averages to $" + `${cheapestCost}`);
       } else {
         message.channel.send("TCGplayer NM market price of " + `${name}` + " is not found.");
       }

    };

    // invoking the main function
    scrape();
  }
}

/*
// main.js code to determine call of [[card name]] in messages
client.on('message', async message => {
  // Make sure its enclosed and called by user
  if (!message.content.includes(mtgOpen) || !message.content.includes(mtgClose) || message.author.bot) return;

  // We know it has an enclosure, let's find it
  const indexStart = message.content.indexOf(mtgOpen);
  const indexEnd = message.content.indexOf(mtgClose);

  // Grab enclosure contents
  let arg = message.content.substring(indexStart + mtgOpen.length, indexEnd);
  // Execute
  client.commands.get('mtg').execute(message, arg);
});
*/
