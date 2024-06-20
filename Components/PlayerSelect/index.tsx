import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Player, PlayerList} from "@/Utils/Type";
import {getPlayerList} from "@/Utils/API";
import {useAtom, useSetAtom} from "jotai/index";
import {squadState} from "@/Utils/Storage/Squad";
import React, {useEffect} from "react";
import PlayerAdd from "@/Components/PlayerAdd";
import {PlayerRow} from "@/Components/PlayerRow";

export default function PlayerSelect(){
    
    const { data,isLoading,fetchNextPage,hasNextPage } = useInfiniteQuery({
        queryFn:({ pageParam })=>getPlayerList({ pageParam,name:"" }),
        queryKey:["player-list"],
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.next,
    })
    
    const setState_squad = useSetAtom(squadState)
    
    const close = () =>{
        setState_squad((prev)=>({
            ...prev,
            selectPosition:null,
            selectIndex:null
        }))
    }
    
    const clickOutside = (e:React.MouseEvent<HTMLDivElement>) =>{
        if(e.target === e.currentTarget){
            close()
        }
    }
    
    return (
        <div className={"fixed w-full h-full z-[1000] bg-white-25"} onClick={clickOutside}>
            <div className={"max-w-screen-md m-auto w-full h-full p-4 flex flex-col gap-2 overflow-auto"}>
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
                            data.pages.map((i)=>(
                                i.data.players.map((j:Player)=>(
                                    <PlayerRow player={j} key={j.spid}/>
                                ))
                            ))
                    }
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}