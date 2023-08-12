var tableToCsv = require("node-table-to-csv");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://ragnarok.one/?module=item&p=";

const headers = {
  authority: "ragnarok.one",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "no-cache",
  cookie:
    "fluxSessionData=d2dbd9c0d91d197a5cdf015bc7cd215f; language=en_us; nightmode=off",
  pragma: "no-cache",
  "sec-ch-ua":
    '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
};

const doStuff = async (page) => {
  const response = await axios.get(URL + page, { headers });

  const $ = cheerio.load(response.data);

  $(".horizontal-table tr:nth-child(1)").each((i, tr) => {
    // Create a new th element with some content.
    const newTh = $("<th>").text("Image");

    // Insert the new th element in the second position.
    const secondTh = $(tr).find("th:nth-child(1)");
    if (secondTh.length > 0) {
      newTh.insertAfter(secondTh);
    } else {
      $(tr).prepend(newTh);
    }
  });

  var createMatrix = function (table1) {
    var table = cheerio.load(table1);

    var matrix = [],
      i = 0;

    table("table tr").each(function () {
      var j = 0;
      matrix[i] = [];

      table(this)
        .find("th")
        .each(function () {
          matrix[i][j] = table(this)
            .text()
            .trim()
            .replace(/(\r\n|\n|\r)/gm, "");
          j++;
          return matrix;
        });

      table(this)
        .find("td")
        .each(function () {
          matrix[i][j] = `"${table(this).text().trim() || `N/A`}"`;
          j++;
          return matrix;
        });
      i++;
    });

    return matrix;
  };

  function createCsv(data) {
    var csv = "";
    for (var i = 0; i < data.length; i++) {
      csv += data[i].join(",") + "\n";
    }
    return csv;
  }

  const table1 = $(".horizontal-table")[0];
  const tableCSV = createCsv(createMatrix(table1));

  if (page === 1) {
    fs.writeFileSync("./table.csv", tableCSV);
  } else {
    const noHeader = tableCSV.substring(tableCSV.indexOf("\n") + 1);
    fs.appendFileSync("./table.csv", noHeader);
  }
};

const doStuffs = async () => {
  const MAX_PAGE = 1122;
  let page = 1;

  while (page < MAX_PAGE) {
    console.log("Grabbing page " + page);
    await doStuff(page);
    page++;
  }
};

const doAnotherStuff = async () => {
  const idQuery =
    "#content > table:nth-child(5) > tbody > tr:nth-child(2) > td:nth-child(2)";
  const minEqpLevel =
    "#content > table:nth-child(5) > tbody > tr:nth-child(8) > td:nth-child(4)";
  const maxEqpLevel =
    "#content > table:nth-child(5) > tbody > tr:nth-child(9) > td:nth-child(4)";
  const equipUpper =
    "#content > table:nth-child(5) > tbody > tr:nth-child(11) > td";
  const equipableJobs =
    "#content > table:nth-child(5) > tbody > tr:nth-child(12) > td";
  const equipableGender =
    "#content > table:nth-child(5) > tbody > tr:nth-child(13) > td";
  const tradeRestriction =
    "#content > table:nth-child(5) > tbody > tr:nth-child(14) > td";
  const description =
    "#content > table:nth-child(5) > tbody > tr:nth-child(15) > td";

  const queries = [
    idQuery,
    minEqpLevel,
    maxEqpLevel,
    equipUpper,
    equipableJobs,
    equipableGender,
    tradeRestriction,
    description,
  ];

  const CSV = fs
    .readFileSync("./table.csv", { encoding: "utf8", flag: "r" })
    .split("\n");

  const headers = CSV.shift();

  const updatedHeaders = headers.concat([
    "Identifier",
    "MinEquipLevel",
    "MaxEquipLevel",
    "equipUpperLevel",
    "equipableJobs",
    "equipableGender",
    "TradeRestriction",
    "Description",
  ]);

  fs.writeFileSync("fodase.csv", updatedHeaders);

  for (const item of CSV) {
    const [id] = item.split(",");
    console.log("Fetching extra data for item " + id);

    const response = await axios.get(
      "https://ragnarok.one/?module=item&action=view&id=" +
        id.replace(/\"/g, "") +
        "&theme=default",
      {
        headers: {
          authority: "ragnarok.one",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          cookie:
            "fluxSessionData=d2dbd9c0d91d197a5cdf015bc7cd215f; language=en_us; nightmode=off",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        },
      }
    );
    const infoPage = cheerio.load(response.data);

    itemInfos = queries.map((query) => {
      return infoPage(query).text().replace(/\t|\n/g, "");
    });

    console.log(item, itemInfos.join(" | "));

    fs.appendFileSync(
      "fodase.csv",
      "\n" + item + ',"' + itemInfos.join('","') + '"'
    );
  }
};

//doStuffs();
doAnotherStuff();
