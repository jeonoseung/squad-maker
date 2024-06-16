import {useQuery} from "@tanstack/react-query";
import {Player, PlayerList} from "@/Utils/Type";
import {getPlayerList} from "@/Utils/API";
import Image from "next/image";
import {useAtom} from "jotai/index";
import {cardState} from "@/Utils/Storage/Card";
import {squadState} from "@/Utils/Storage/Squad";
import {ChangeEvent, useState} from "react";
import {LevelArray} from "@/Utils/Data";
import {SetBP} from "@/Utils/Function";

export default function PlayerSelect(){

    const { data,isLoading } = useQuery<PlayerList>({
        queryFn:getPlayerList,
        queryKey:["player-list"]
    })
    
    return (
        <div className={"fixed w-full h-full z-[1000] bg-white-50"}>
            <div className={"max-w-screen-md m-auto w-full h-full p-4"}>
                <div className={"grid gap-4"}>
                    {
                        isLoading 
                            ?
                            <div className={"min-h-[500px] flex justify-center items-center"}>
                                로딩 중....
                            </div>
                            :
                            data &&
                            data.players.map((li,index)=>(
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
interface PlayerRow {
    player:Player
}
function PlayerRow({ player }:PlayerRow){

    const [ state_card,setState_card ] = useAtom(cardState)
    const [ state_squad, setState_squad ] = useAtom(squadState)
    const [state,setState] = useState({
        level:1
    })
    
    const clickRow = () =>{
        const { selectIndex,selectPosition } = state_squad
        const isGK = state_card.some((li)=>li.player?.main_position.includes("GK"))
        if(state_card.some((li)=>li.player?.spid === player.spid)){
            alert("이미 선택한 선수입니다.")
        }
        else if(selectPosition === "gk" && !isGK){
            alert("골키퍼만 선택 가능합니다.")
        }
        else if(selectPosition !== "gk" && isGK){
            alert("골키퍼는 골키퍼 포지션에만 배치 가능합니다.")
        }
        else if(selectIndex === null) {
            alert("선택된 카드를 찾을 수 없습니다.")
        }
        else {
            setState_card((prev)=>{
                const copy = [...prev]
                copy[selectIndex] = {
                    ...copy[selectIndex],
                    player,
                    level:state.level
                }
                return copy
            })
            setState_squad((prev)=>({
                ...prev,
                selectPosition:null,
                selectIndex:null
            }))
        }
    }
    
    const changeLevel = (e:ChangeEvent<HTMLSelectElement>) =>{
        setState((prev)=>({
            ...prev,
            level: Number(e.target.value)
        }))
    }
    
    return (
        <div className={"bg-white border-2 border-gray-900 rounded-xl flex items-center p-4 gap-4 hover:cursor-pointer"} onClick={clickRow}>
            <div
                className={"w-[35px] h-[35px] flex justify-center items-center rounded-full border-2 border-default bg-white text-black"}>
                {player.pay}
            </div>
            <div className={"w-[100px] h-auto"}>
                <Image src={player.img} alt={"선수 이미지"} width={100} height={100}/>
            </div>
            <div className={"flex flex-col gap-1"}>
                <div className={"flex gap-1 text-black"}>
                    <Image src={player.season_img} alt={"시즌 아이콘"} width={30} height={15}/>
                    <span>{player.name}</span>
                    <MainPosition position={player.main_position}/>
                </div>
                <div className={"flex gap-1"}>
                    <select onChange={changeLevel}>
                        {
                            LevelArray.map((li, index) => (
                                <option key={li} value={`${li}`}>{li}</option>
                            ))
                        }
                    </select>
                    <span className={"font-medium"}>
                        {SetBP(player.bp, state.level)} BP
                    </span>
                </div>
            </div>
        </div>
    )
}

interface MainPosition {
    position: string
}

function MainPosition({position}: MainPosition) {
    const split = position.split(",")
    if (split.length === 0) {
        return (
            <span>-</span>
        )
    }

    return (
        split.map((li) => {
            const [position, value] = li.split(" ")

            return (
                <p className={"flex gap-1"} key={li}>
                    <span className={`color-${position.toLowerCase()}`}>{position}</span>
                    <span>{value}</span>
                </p>
            )
        })
    )
}