
import puppeteer from "puppeteer";
import {GetInfoWrap, GetOvrSet, GetPlayerMainStatus, GetPlayerPrice} from "@/Utils/Function/API";
import {con, pool} from "@/Utils/DB";

function sleep(ms:number) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function POST(request: Request,{ params }: { params:{ [key:string]:string } }) {

    const conn = await con()
    const browser = await puppeteer.launch()
    
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
        if(row){
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

        const bp = await GetPlayerPrice(page)
        const ovr = await GetOvrSet(page)
        const main_status = await GetPlayerMainStatus(page)

        const insert_array = [
            pid_number,
            info.name,
            info.player_img,
            info.card_img,
            info.season_icon,
            info.season_big_icon,
            info.pay,
            bp,
            info.main_position,
            JSON.stringify(main_status),
            JSON.stringify(ovr),
            info.country
        ]
        
        const insert = 
            `INSERT INTO player (spid,name,img,card_img,season_img,season_big_icon,pay,bp,main_position,main_status,ovr_set,country) 
            values (?,?,?,?,?,?,?,?,?,?,?,?)`
        
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