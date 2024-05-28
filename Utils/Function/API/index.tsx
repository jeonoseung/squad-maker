import {Page} from "puppeteer";


export const GetPlayerMainStatus = async (page:Page) =>{
    return await page.evaluate(()=>{
        let status:{ [key:string]:number } = {}
        const content_middle = document.querySelector(".content_middle")
        if(content_middle === null) {
            return "content_middle is null"
        }
        const ul = content_middle.querySelector("ul")
        if(ul === null){
            return "main status ul is null"
        }
        const ab = content_middle.querySelectorAll(".ab")
        for(let i=0;i < ab.length;i++){
            const el = ab[i]
            const txt = el.querySelector(".txt")
            const value = el.querySelector(".value")
            if(!txt || !value){
                return "main status txt or value is null"
            }
            status[txt.innerHTML] = parseInt(value.innerHTML)
        }
        return status
    })
}

export const GetOvrSet = async (page:Page) =>{
    return await page.evaluate(()=>{
        let ovr:{ [key:string]:number } = {}
        const ovr_set = document.querySelector(".ovr_set")
        if(ovr_set === null){
            return "ovr_set is null"
        }
        const position = ovr_set.querySelectorAll(".position")
        for(let i=0;i<position.length;i++){
            const p = position[i]
            const txt = p.classList[1]
            ovr[txt] = parseInt(p.innerHTML)
        }
        return ovr
    })
}

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

export const GetInfoWrap = async (page:Page) =>{
    return await page.evaluate(()=>{
        const info = {
            card_img:"",
            player_img:"",
            season_big_icon:"",
            season_icon:"",
            name:"",
            main_position:"",
            pay:0,
            profile:""
        }
        //우측 선수 카드 
        const thumb = document.querySelector(".thumb")
        if(thumb === null) {
            return "thumb is null"
        }

        //선수 카드 배경 이미지
        const card_back = thumb.querySelector(".card_back")
        if(card_back === null){
            return "card_back is null"
        }
        const card_back_img = card_back.querySelector("img")
        if(card_back_img === null){
            return "card_back_img is null"
        }
        else {
            info.card_img = card_back_img.src
        }

        //선수 이미지
        const player_img_wrap = thumb.querySelector(".img")
        if(player_img_wrap === null){
            return "player_img_wrap is null"
        }
        const player_img = player_img_wrap.querySelector("img")
        if(player_img === null){
            return "player_img is null"
        }
        else {
            info.player_img = player_img.src
        }

        //선수 시즌 빅 아이콘
        const big_icon_wrap = thumb.querySelector(".season")
        if(big_icon_wrap === null){
            return "big_icon_wrap is null"
        }
        const big_icon_img = big_icon_wrap.querySelector("img")
        if(big_icon_img === null){
            return "big_icon_img is null"
        }
        else {
            info.season_big_icon = big_icon_img.src
        }

        //좌측 선수 정보
        const info_wrap = document.querySelector(".info_wrap")
        if(info_wrap === null){
            return "info_wrap is null"
        }

        //선수 명
        const info_name = info_wrap.querySelector(".info_name")
        if(info_name === null){
            return "info_name is null"
        }
        const name = info_name.querySelector(".name")
        if(name === null){
            return "name is null"
        }
        else {
            info.name = name.innerHTML
        }

        //선수 시즌 아이콘
        const season_img_wrap = info_name.querySelector(".season")
        if(season_img_wrap === null){
            return "season_img_wrap is null"
        }
        const season_img = season_img_wrap.querySelector("img")
        if(season_img === null) {
            return "season_img is null"
        }
        else {
            info.season_icon = season_img.src
        }

        //선수 급여
        const pay_side = info_name.querySelector(".pay_side")
        if(pay_side === null){
            return "pay_side is null"
        }
        else {
            const pay = Number(pay_side.innerHTML)
            if(isNaN(pay)){
                info.pay = -1
            }
            else {
                info.pay = pay
            }
            info.pay = Number(pay_side.innerHTML)
        }

        //선수 메인 포지션
        const main_position_wrap = info_wrap.querySelector(".info_ab")
        if(main_position_wrap === null){
            return "main_position_wrap is null"
        }
        const position = main_position_wrap.querySelectorAll(".position")
        for(let i=0;i<position.length;i++){
            const p = position[i]
            const txt = p.querySelector(".txt")
            if(txt === null){
                info.main_position += "NULL "
            }
            else {
                info.main_position += `${txt.innerHTML} `
            }
            const value = p.querySelector(".value")
            if(value === null){
                info.main_position += "000"
            }
            else {
                info.main_position += value.innerHTML
            }
        }

        return info
    })
}