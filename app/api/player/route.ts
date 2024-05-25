export async function GET(request: Request) {
    
    
    
    return Response.json({ 
        data:"안녕"
    },{
        headers:{
            "Content-Type":"text/html; charset=utf-8"
        }
    })
}