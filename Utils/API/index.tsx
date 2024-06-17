import axios from "axios";

export const getPlayerList = async () => {
    const res = await axios.get("/api/players")
    return res.data
}

export const postPlayer = async ({ pid }:{ pid:number }) =>{
    const res = await axios.post(`/api/player/${pid}`)
    return res.data
}