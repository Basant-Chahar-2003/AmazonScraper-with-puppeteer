const express = require("express")
const cors = require("cors")
const puppeteer = require("puppeteer")

const app = express()
app.use(cors({
cors : '*'
}))
app.use(express.json())

async function run(input){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://www.amazon.in/s?k=${input}`)
    
    const titles = [];
    const prices = []
    const ratings = []

    for (let dataIndexValue = 1; dataIndexValue <= 40; dataIndexValue++) {
      const selector_title = `div[data-index="${dataIndexValue}"] .a-section h2 a span`;
      const selector_price = `div[data-index="${dataIndexValue}"] .a-section .a-price .a-price-whole`;
      const selector_rating = `div[data-index="${dataIndexValue}"] .a-section .a-icon-alt`;
    
      const title = await page.evaluate(selector_title => {
        const titleElement = document.querySelector(selector_title);
        return titleElement ? titleElement.innerText : null;
      }, selector_title);
      const price = await page.evaluate(selector_price => {
        const titleElement = document.querySelector(selector_price);
        return titleElement ? titleElement.innerText : null;
      }, selector_price);
      const rating = await page.evaluate(selector_rating => {
        const titleElement = document.querySelector(selector_rating);
        return titleElement ? titleElement.innerText : null;
      }, selector_rating);

      if (title) {
        titles.push(title);
      }
      if (price) {
        prices.push(price);
      }
      if (rating) {
        ratings.push(rating);
      }
    }
    const combinedData = {
        total_titles : titles,
        total_prices : prices,
        total_ratings : ratings
    }
    // console.log(combinedData)
    await browser.close()
    return combinedData
}

app.get('/' ,async (req,res)=>{
    const input = req.query.input
    const data = await run(input)
    console.log(data)
    res.json(data)
})

app.listen(3000)