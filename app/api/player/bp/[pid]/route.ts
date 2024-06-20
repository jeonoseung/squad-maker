import {Params} from "@/Utils/Type";
import {con} from "@/Utils/DB";
import puppeteer from "puppeteer";
import {GetPlayerBP, SetResponse} from "@/Utils/Function/API";
import {sleep} from "@/Utils/Function";

export async function PATCH(request: Request,{ params }:{ params:Params }){
    const conn = await con()
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    try {
        const pid = params.pid
        const pid_number = Number(pid)
        if(isNaN(pid_number)) {
            return SetResponse({
                data:{
                    message: "찾을 수 없는 선수입니다.",
                },
                status:400
            })
        }
        const select_array = [pid_number]
        const [ row ] = await conn.query(`SELECT spid FROM player WHERE spid = ?`,select_array)
        const find = row as any
        if(find.length === 0){
            return SetResponse({
                data:{
                    message:"존재하지 않는 선수입니다.",
                },
                status:400
            })
        }
        const page = await browser.newPage()
        await page.goto(`https://fconline.nexon.com/DataCenter/PlayerInfo?spid=${pid_number}`)
        await sleep(500)
        const bp = await GetPlayerBP(page)
        const update_array = [
            String(bp),
            new Date(),
            pid_number
        ]
        const update = `UPDATE player SET bp = ?, bp_update_time = ? WHERE spid = ?`
        await conn.query(update,update_array)
     
        return SetResponse({
            status:201
        })
    }
    catch(error:any) {
        console.log(error)
        return SetResponse({
            data:{
                message:"선수 BP 새로고침 처리가 실패했습니다.",
                content:error.code
            },
            status:400
        })
    } finally {
        conn.release()
        await browser.close()
    }
    
}