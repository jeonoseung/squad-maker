import axios from "axios";

export const getPlayerList = async ({ pageParam,name }:{ pageParam:number,name:string }) => {
    const res = await axios.get(`/api/players?page=${pageParam}&name=${name}`)
    return {
        data:res.data,
        next:pageParam+1
    }
}

export const postPlayer = async ({ pid }:{ pid:number }) =>{
    const res = await axios.post(`/api/player/${pid}`)
    return res.data
}

export const patchPlayerBP = async ({ pid }:{ pid:number }) =>{
    const res = await axios.patch(`/api/player/bp/${pid}`)
    return res.data
}