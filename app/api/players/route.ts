import {con, pool} from "@/Utils/DB";

export async function GET(){
    const conn = await con()
    try {
        const [result] = await conn.query(`SELECT * FROM player`)
        
        return Response.json({
            players:result
        },{
            status:200,
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            }
        })
    }
    catch (error:any){
        console.log(error)
        return Response.json({
            message:"선수 목록 조회가 실패했습니다.",
            content:error.code
        },{
            status:400,
            headers:{
                "Content-Type":"text/html; charset=utf-8"
            }
        })
    }
    finally {
        conn.release()
    }
    
}