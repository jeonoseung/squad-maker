import {con} from "@/Utils/DB";
import {Params} from "@/Utils/Type";
import {SetResponse} from "@/Utils/Function/API";

export async function GET(request:Request,{ params }:{ params:Params }){
    const url = new URL(request.url)
    const search = url.searchParams
    const page = search.get("page")
    const name = search.get("name")
    const conn = await con()
    try {
        const p = 
            page 
                ? isNaN(Number(page))
                    ? 0
                    : Number(page) - 1
                : 0
        const n = name ? name : ""
        let query = `SELECT * FROM player WHERE name LIKE ? ORDER BY update_time DESC LIMIT ?, 1`
        const query_array = [
            `%${n}%`,
            p
        ]
        const [result] = await conn.query(query,query_array)
        return SetResponse({
            data:{
                players:result
            },
            status:200
        })
    }
    catch (error:any){
        console.log(error)
        return SetResponse({
            data:{
                message:"선수 목록 조회가 실패했습니다.",
                content:error.code
            },
            status:400
        })
    }
    finally {
        conn.release()
    }
    
}