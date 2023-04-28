const puppeteer = require('puppeteer');
const config = require('./config');

list_extract();
var counter = 1;

async function list_extract() {
    try {

        var browser = await puppeteer.launch({
            headless: false,
            args: [

                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--deterministic-fetch',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
            ],
            defaultViewport: null,
        });
        var page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 RuxitSynthetic/1.0 v3290252358115919606 t1210004724995914732 ath259cea6f altpriv cvcv=2 cexpw=1 smf=0'
        ) // user agents hadrcoded to avoid captcha
    } catch (err) {
        console.log(err);
        process.exit();
    }

    try {
        //link of the website ↓
        await page.goto('config.WEB_URL', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 3000));

        rows = await page.evaluate(() => {
            const container = document.querySelector("") // select all divs by putting in selector           
            const hrefs = [];
            divswithclass.forEach((div) => {
                const anchors = div.querySelectorAll('a'); // select all anchor tags inside the div
                anchors.forEach((a) => {
                    hrefs.push(a.href); // push href value to array
                });
            });
            return hrefs;
        });

        while (1) {

            try {
                //link of the website with page number ↓
                await page.goto(`https://www.bedbathandbeyond.com/store/category/bedding/duvet-covers/15507/${counter}-48?removeInStock=true`, { waitUntil: 'networkidle2', timeout: 60000 });

                const rows = await page.evaluate(() => {
                    const container = document.querySelector("") // select all divs by putting in selector
                    const hrefs = [];
                    divswithclass.forEach((div) => {
                        const anchors = div.querySelectorAll('a'); // select all anchor tags inside the div
                        anchors.forEach((a) => {
                            hrefs.push(a.href); // push href value to array
                        });
                    });
                    return hrefs;
                });


                if (counter > config.NUMBER_OF_PAGES) break; // to break loop when all pages are scrapped
            } catch (err) {
                console.log(err);
            }
        }

        // Convert the data object to a JSON string
        const jsonData = JSON.stringify(rows);

        // Write the JSON string to a file named 'data.json'
        fs.writeFile('products.json', jsonData, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Data saved to data.json');
        });


    } catch (err) {
        console.log(err);
    }
    finally {
        await browser.close();
    }

}
