import puppeteer, {Page} from "puppeteer";
import {GetPlayerPrice} from "@/Utils/Function/API";

function sleep(ms:number) {
    return new Promise((r) => setTimeout(r, ms));
}

/**
 * 선수 정보 = .info_wrap
 * 선수 포지션 별 ovr = .ovr_set
 * 선수 메인 status = .content_middle
 * 선수 전체 status = .content_bottom
 * 선수 시세 = .view_wrap -> #view_wrap -> #priceContent -> .header -> .add_info -> .txt -> strong
 * */

const GetInfoWrap = async (page:Page) =>{
    return await page.evaluate(()=>{
        const info = {
            card_img:"",
            player_img:"",
            season_big_icon:"",
            season_icon:"",
            name:"",
            main_position:"",
            pay:0,
            price:0,
            profile:"",
            ovr:{GK:0, LB:0, SW:0, RB:0, LWB:0, CB:0, RWB:0, CDM:0, LM:0, CM:0, RM:0, CAM:0, LW:0, CF:0, RW:0, ST:0},
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
        
        //선수 메인 포지션
        const main_position_wrap = info_wrap.querySelector(".info_ab")
        if(main_position_wrap === null){
            return "main_position_wrap is null"
        }
        const position = main_position_wrap.getElementsByClassName("position")
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

export async function GET(request: Request,{ params }: { params:{ [key:string]:string } }) {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(`https://fconline.nexon.com/DataCenter/PlayerInfo?spid=${params.pid}`)
    await sleep(1000)
    
    const info = await GetInfoWrap(page)
    const bp = await GetPlayerPrice(page)
    let json = {}
    if(typeof info !== "string"){
        json = {
            ...json,
            ...info
        }
    }
    json = {
        ...json,
        bp
    }
    await browser.close()
    return Response.json({ 
        data:json
    },{
        headers:{
            "Content-Type":"text/html; charset=utf-8"
        }
    })
}