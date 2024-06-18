import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Player, PlayerList} from "@/Utils/Type";
import {getPlayerList, patchPlayerBP, postPlayer} from "@/Utils/API";
import Image from "next/image";
import {useAtom} from "jotai/index";
import {cardState} from "@/Utils/Storage/Card";
import {squadState} from "@/Utils/Storage/Squad";
import React, {ChangeEvent, useRef, useState} from "react";
import {LevelArray} from "@/Utils/Data";
import {CheckBPRefresh, ErrorMessage, SetBP, SetTimeAgo} from "@/Utils/Function";
import PlayerAdd from "@/Components/PlayerAdd";
import {AxiosError} from "axios";
import {PlayerRow} from "@/Components/PlayerRow";

export default function PlayerSelect(){

    const { data,isLoading } = useQuery<PlayerList>({
        queryFn:getPlayerList,
        queryKey:["player-list"]
    })
    

    const [ state_squad, setState_squad ] = useAtom(squadState)
    
    const close = () =>{
        setState_squad((prev)=>({
            ...prev,
            selectPosition:null,
            selectIndex:null
        }))
    }
    
    return (
        <div className={"fixed w-full h-full z-[1000] bg-white-25"}>
            <div className={"max-w-screen-md m-auto w-full h-full p-4 flex flex-col gap-2"}>
                <div className={"flex justify-end"}>
                    <button className={"text-white px-4 py-1 rounded text-sm bg-red-500"} onClick={close}>
                        닫기
                    </button>
                </div>
                <PlayerAdd/>
                <div className={"grid gap-4"}>
                    {
                        isLoading
                            ?
                            <div className={"min-h-[500px] flex justify-center items-center"}>
                                로딩 중....
                            </div>
                            :
                            data &&
                            data.players.map((li, index) => (
                                <PlayerRow player={li} key={li.spid}/>
                            ))
                    }
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}