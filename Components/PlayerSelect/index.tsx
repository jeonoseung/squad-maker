import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Player, PlayerList} from "@/Utils/Type";
import {getPlayerList} from "@/Utils/API";
import {useAtom, useSetAtom} from "jotai/index";
import {squadState} from "@/Utils/Storage/Squad";
import React, {useEffect, useRef} from "react";
import PlayerAdd from "@/Components/PlayerAdd";
import {PlayerRow} from "@/Components/PlayerRow";
import PlayerSearch from "@/Components/PlayerSearch";

export default function PlayerSelect(){
    const [ state_squad,setState_squad ] = useAtom(squadState)
    const { data,isLoading,fetchNextPage,hasNextPage,isFetching } = 
        useInfiniteQuery<PlayerList>({
            queryFn:({ pageParam })=>getPlayerList({ pageParam,name:state_squad.searchInput }),
            queryKey:["players",state_squad.searchInput],
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.next,
        })
    
    
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
    
    const table = useRef<HTMLDivElement>(null)
    const button = useRef<HTMLButtonElement>(null)
    const check = useRef<boolean>(true)
   
    const TableScrollEvent = (e:React.UIEvent<HTMLDivElement>) =>{
        if(!hasNextPage || !check.current){
            return
        }
        const t = e.currentTarget
        const t_s_height = t.scrollHeight
        const t_s_top = t.scrollTop
        const diff = t_s_height - t.clientHeight
        if(diff < t_s_top) {
            check.current = false
            fetchNextPage().then(()=>{
                check.current = true
            })
        }
    }
    return (
        <div className={"fixed w-full h-full z-[1000] bg-white-25"} onClick={clickOutside}>
            <div 
                className={"max-w-screen-md m-auto w-full h-full p-4 flex flex-col gap-2 overflow-auto"} 
                onScroll={TableScrollEvent} 
                ref={table}
            >
                <div className={"flex justify-end"}>
                    <button className={"text-white px-4 py-1 rounded text-sm bg-red-500"} onClick={close}>
                        닫기
                    </button>
                </div>
                <PlayerAdd/>
                <PlayerSearch/>
                <div className={"grid gap-4"}>
                    {
                        isLoading
                            ?
                            <div className={"min-h-[500px] flex justify-center items-center"}>
                                로딩 중....
                            </div>
                            :
                            data &&
                            data.pages.map((i,index)=>(
                                i.players.length === 0 
                                    ?
                                    <div key={`player-null-${index}`} className={"min-h-[350px] flex justify-center items-center text-red-500 text-lg"}>
                                        조회 가능한 선수가 없습니다.
                                    </div>
                                    :
                                    i.players.map((j:Player)=>(
                                        <PlayerRow player={j} key={j.spid}/>
                                    ))
                            ))
                    }
                    <div>
                        {
                            hasNextPage &&
                                <button ref={button} className={"w-full"} onClick={() => !isFetching && fetchNextPage()}>
                                    더보기
                                </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}