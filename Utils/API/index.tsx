import axios from "axios";
import {ListLength} from "@/Utils/Data";

export const getPlayerList = async ({ pageParam,name }:{ pageParam:number,name:string }) => {
    const res = await axios.get(`/api/players?page=${pageParam}&name=${name}`)
    const length = res.data.players.length
    return {
        players:res.data.players,
        next:length >= ListLength ? pageParam+1 : undefined
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