
import puppeteer from "puppeteer";
import {GetInfoWrap, GetOvrSet, GetPlayerMainStatus, GetPlayerPrice} from "@/Utils/Function/API";
import {con, pool} from "@/Utils/DB";
import {GetDateTimeNow, sleep} from "@/Utils/Function";


export async function POST(request: Request,{ params }: { params:{ [key:string]:string } }) {

    const conn = await con()
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try{
        const pid = params.pid
        const pid_number = Number(pid)

        if(isNaN(pid_number)) {
            return Response.json({
                message: "올바르지 않는 경로입니다.",
                content: "다시 한번 확인해주세요."
            }, {
                status: 400,
                headers: {
                    "Content-Type": "text/html; charset=utf-8"
                }
            })
        }

        const select_array = [pid_number]
        const [ row ] = await conn.query(`SELECT spid FROM player WHERE spid = ?`,select_array)
        const find = row as any
        if(find.length !== 0){
            return Response.json({
                message:"이미 등록된 선수입니다.",
                code:"E0001"
            },{
                status:400,
                headers:{
                    "Content-Type":"text/html; charset=utf-8"
                }
            })
        }


        const page = await browser.newPage()
        await page.goto(`https://fconline.nexon.com/DataCenter/PlayerInfo?spid=${params.pid}`)
        await sleep(500)
        const info = await GetInfoWrap(page)
        if(typeof info === "string"){
            return Response.json({
                message:"플레이어를 찾을 수 없습니다."
            },{
                status:400,
                headers:{
                    "Content-Type":"text/html; charset=utf-8"
                }
            })
        }
        const ovr = await GetOvrSet(page)
        const main_status = await GetPlayerMainStatus(page)
        const bp = await page.evaluate(async ()=>{
            const info_wrap = document.querySelector(".info_wrap")
            if(info_wrap === null) return 0
            const en_selector_wrap = info_wrap.querySelector(".en_selector_wrap")
            if(en_selector_wrap === null) return 0
            const selector_wrap = en_selector_wrap.querySelector(".selector_wrap")
            if(selector_wrap === null) return 0
            const ability = selector_wrap.querySelector(".ability") as HTMLElement | null
            if(ability === null) return 0
            ability.click()
            const selector_list = selector_wrap.querySelector(".selector_list") as HTMLElement
            if(selector_list === null) return 0
            const li = selector_wrap.querySelectorAll("li")
            const array = []
            function sleep(ms:number) {
                return new Promise((r) => setTimeout(r, ms));
            }
            for(let i=1;i<li.length;i++){
                const l = li[i]
                const a = l.querySelector("a")
                a?.click()
                await sleep(200)
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
                array.push(result)
                ability.click()
            }
            return array
        })


        const insert_array = [
            pid_number,
            info.name,
            info.player_img,
            info.card_img,
            info.season_icon,
            info.season_big_icon,
            info.pay,
            String(bp),
            info.main_position,
            JSON.stringify(main_status),
            JSON.stringify(ovr),
            info.country,
            new Date(),
            new Date()
        ]
        const insert =
            `INSERT INTO player (spid,name,img,card_img,season_img,season_big_icon,pay,bp,main_position,main_status,ovr_set,country,update_time,bp_update_time) 
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

        await conn.query(insert,insert_array);

        return Response.json({
            message:"선수가 등록되었습니다."
        },{
            status:201,
            headers:{
                "Content-Type":"text/html; charset=utf-8"
            }
        })

    } catch(error:any) {
        console.log(error)
        return Response.json({
            message:"선수 추가가 실패했습니다.",
            content:error.code
        },{
            status:400,
            headers:{
                "Content-Type":"text/html; charset=utf-8"
            }
        })
    } finally {
        conn.release()
        await browser.close()
    }
}

