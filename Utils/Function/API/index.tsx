import {Page} from "puppeteer";

export const GetPlayerPrice = async (page:Page) =>{
    return await page.evaluate(() => {
        const view_wrap = document.querySelector(".view_wrap")
        if(view_wrap === null) return 0;
        const _view_wrap = view_wrap.querySelector("#priceToggle")
        if(_view_wrap === null) return 0
        const price_content = _view_wrap.querySelector("#priceContent")
        if(price_content === null) return 0
        const header = price_content.querySelector(".header")
        if(header === null) return 0
        const add_info = header.querySelector(".add_info")
        if(add_info === null) return 0
        const txt = add_info.querySelector(".txt")
        if(txt === null) return 0
        const price = txt.querySelector("strong")
        if(price === null) return 0
        const innerText = price.innerText
        const remove_unit = innerText.replace(" BP","")
        const split = remove_unit.split(",")
        const join = split.join("")
        const result = Number(join)
        if(isNaN(result)){
            return 0
        }
        else {
            return result
        }
    })
}