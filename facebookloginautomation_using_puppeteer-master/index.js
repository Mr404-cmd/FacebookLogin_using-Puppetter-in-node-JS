const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config');
const cookies = require('./cookies');

(async ()=>{
    let browser= await puppeteer.launch({headless:false})
    let page = await browser.newPage();
    if(Object.keys(cookies).length){
        await page.setCookie(...cookies);
        await page.goto('https://www.facebook.com/',{waitUntil:'networkidle2'})
    }
    else{
        await page.goto('https://www.facebook.com/',{waitUntil:'networkidle0'})
        await page.type('#email',config.user, {delay:30})
        await page.type('#pass',config.pass, {delay:30})
        await page.click('#loginbutton')
        await page.waitForNavigation({waitUntil:'networkidle0'});
        await page.waitFor(15000);
        try{
            await page.waitFor('[data-click="profile_icon"]')
        }catch(err)
        {
            console.log('failed to login')
            process.exit(0)
        }
        let currentcookies = await page.cookies()
        fs.writeFileSync('./cookies',JSON.stringify(currentcookies))
    }
})()