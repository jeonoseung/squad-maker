
import puppeteer from "puppeteer";
import {GetInfoWrap, GetOvrSet, GetPlayerMainStatus, GetPlayerPrice} from "@/Utils/Function/API";
import {pool} from "@/Utils/DB";

function sleep(ms:number) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function GET(request: Request,{ params }: { params:{ [key:string]:string } }) {
    
    const pid = params.pid
    const pid_number = Number(pid)
    if(isNaN(pid_number)){
        return Response.json({
            message:"올바르지 않는 경로입니다.",
            content:"다시 한번 확인해주세요."
        },{
            status:400,
            headers:{
                "Content-Type":"text/html; charset=utf-8"
            }
        })
    }
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://fconline.nexon.com/DataCenter/PlayerInfo?spid=${params.pid}`)
    await sleep(1000)
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
    let json = {}
    json = {
        ...info,
        bp:bp,
        ovr:ovr,
        main_status
    }
    await browser.close()
    
    const insert_array = [
        pid_number,info.name,info.player_img,info.card_img,info.season_icon,info.season_big_icon,info.pay,bp,info.main_position,JSON.stringify(main_status),JSON.stringify(ovr)
    ]

    const conn = await pool.getConnection()
    
    
    
    try{
        const res = await conn.query(`
                    INSERT INTO 
                    player (spid,name,img,card_img,season_img,season_big_icon,pay,bp,main_position,main_status,ovr_set) 
                    values (?,?,?,?,?,?,?,?,?,?,?)
                    `,insert_array);
        
        return Response.json({
            message:"선수가 추가되었습니다."
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
        await conn.end()
    }
}