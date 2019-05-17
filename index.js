require("dotenv").config()

const Nightmare = require("nightmare")
const nightmare = Nightmare({ show: true })
const download = require("download")
const fs = require("fs")

//https://discordapp.com/channels/@me/539924277881995292

const loginSelector = `#app-mount > div.app-19_DXt.platform-web > div > div.leftSplit-1qOwnR.hasLogo-2bq2VW > div > form > div > div.block-egJnc0.marginTop20-3TxNs6 > div.marginBottom20-32qID7 > div > input`
const passwordSelector = `#app-mount > div.app-19_DXt.platform-web > div > div.leftSplit-1qOwnR.hasLogo-2bq2VW > div > form > div > div.block-egJnc0.marginTop20-3TxNs6 > div:nth-child(2) > div > input`
const buttonSelector = `#app-mount > div.app-19_DXt.platform-web > div > div.leftSplit-1qOwnR.hasLogo-2bq2VW > div > form > div > div.block-egJnc0.marginTop20-3TxNs6 > button.marginBottom8-AtZOdT.button-3k0cO7.button-38aScr.lookFilled-1Gx00P.colorBrand-3pXr91.sizeLarge-1vSeWK.fullWidth-1orjjo.grow-q77ONN`

const existingVideos = fs.readdirSync("./video")

nightmare
  .goto("https://discordapp.com/channels/@me/539924277881995292")
  .type(loginSelector, process.env.EMAIL)
  .type(passwordSelector, process.env.PASSWORD)
  .click(buttonSelector)
  .wait(5000)
  .goto("https://discordapp.com/channels/@me/539924277881995292")
  .wait("a[href^='https://www.gifyourgame.com']")
  .evaluate(() =>
    Array.from(
      document.querySelectorAll("a[href^='https://www.gifyourgame.com']")
    )
      .map(e => e.innerText)
      .filter(text => text)
      .map(link => `${link.replace("www", "media")}_1080p.mp4`)
  )
  .end()
  .then(async results => {
    const filteredResults = results.filter(
      videoUrl =>
        !existingVideos.some(existingVideo => videoUrl.includes(existingVideo))
    )

    for (let videoUrl of filteredResults) {
      await download(videoUrl, "video")
    }
  })
  .catch(error => {
    console.error("Search failed:", error)
  })
