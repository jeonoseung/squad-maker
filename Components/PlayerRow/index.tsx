import {Player, PlayerList} from "@/Utils/Type";
import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from "react";
import {useAtom} from "jotai/index";
import {cardState} from "@/Utils/Storage/Card";
import {squadState} from "@/Utils/Storage/Squad";
import {InfiniteData, useMutation, useQueryClient} from "@tanstack/react-query";
import {patchPlayerBP} from "@/Utils/API";
import {AxiosError} from "axios";
import {CheckBPRefresh, ErrorMessage, GetDateTimeNow, SetBP, SetTimeAgo} from "@/Utils/Function";
import Image from "next/image";
import {LevelArray} from "@/Utils/Data";
import RefreshIcon from "@/Container/Icon/Refresh";

interface PlayerRow {
    player:Player
}
export function PlayerRow({ player }:PlayerRow){
    const check = useRef<boolean>(false)
    const [ state_card,setState_card ] = useAtom(cardState)
    const [ state_squad, setState_squad ] = useAtom(squadState)
    const [state,setState] = useState({
        level:1,
        isLoading:false,
        isSelected:false
    })
    const qc = useQueryClient()
    
    const clickRow = () =>{
        const { selectIndex,selectPosition } = state_squad
        const isGK = player.main_position.includes("GK")
        if(state_card.some((li)=>li.player?.name === player.name)){
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
    const { mutate:RefreshStart } = useMutation({
        mutationFn:patchPlayerBP,
        onMutate:()=>{
            check.current = true
            setState((prev)=>({
                ...prev,
                isLoading: true
            }))
        },
        onSettled:()=>{
            setTimeout(()=>{
                check.current = false
                setState((prev)=>({
                    ...prev,
                    isLoading: false
                }))
            },500)
        },
        onError:(error:AxiosError)=>{
            ErrorMessage(error,"선수 BP 새로고침 처리가 실패했습니다.")
        },
        onSuccess:(res)=>{
            /** 목록이 너무 많으면 과부하가 예상되기에 BP 새로고침 시 해당 쿼리 데이터만 직접 수정 */
            qc.setQueriesData({ queryKey:["players"] },(data:InfiniteData<PlayerList, unknown> | undefined)=>{
                if(data){
                    const copy= { ...data }
                    const pages = [ ...copy.pages ]
                    const pages_copy = pages.map((li)=>{
                        const players = li.players.map((i)=>{
                            if(i.spid === player.spid){
                                const copy = { ...i }
                                copy.bp = res.bp
                                copy.bp_update_time = GetDateTimeNow()
                                return copy
                            }
                            else {
                                return i
                            }
                        })
                        return {
                            ...li,
                            players
                        }
                    })
                    return {
                        ...copy,
                        pages:pages_copy
                    }
                }
                else {
                    return data
                }
            })
        }
    })

    const clickRefreshBP = (e:React.MouseEvent<HTMLButtonElement>) =>{
        e.stopPropagation()
        e.preventDefault()
        if(check.current){

        }
        else if(!CheckBPRefresh(player.bp_update_time)){
            alert(`아직 새로고침 할 수 없습니다. (${SetTimeAgo(player.bp_update_time)}) 업데이트 되었습니다.`)
        }
        else {
            RefreshStart({
                pid:player.spid
            })
        }
    }

    useEffect(() => {
        const isSelected = state_card.some((li)=>li.player?.name === player.name)
        setState((prev)=>({
            ...prev,
            isSelected
        }))
    }, [])

    return (
        <div className={"relative bg-white overflow-hidden hover:bg-gray-200 border-2 border-gray-900 rounded-xl flex items-center p-4 gap-4 hover:cursor-pointer"} onClick={clickRow}>
            <div
                className={"w-[35px] h-[35px] flex justify-center items-center rounded-full border-2 border-default bg-white text-black"}>
                {player.pay}
            </div>
            <div className={"w-[100px] h-auto"}>
                <Image src={player.img} alt={"선수 이미지"} width={100} height={100}/>
            </div>
            <div className={"flex flex-col gap-2"}>
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
                    <p className={"flex gap-0.5"}>
                        <span className={"font-medium"}>
                            {SetBP(player.bp, state.level)} BP
                        </span>
                        {
                            CheckBPRefresh(player.bp_update_time)
                                ?
                                <button className={`hover:text-green-500 transition-colors duration-500`}
                                        onClick={clickRefreshBP}>
                                    <RefreshIcon size={20}/>
                                </button>
                                :
                                <button className={`text-gray-300`} onClick={clickRefreshBP}>
                                    <RefreshIcon size={20}/>
                                </button>
                        }
                    </p>
                </div>
            </div>
            {
                state.isLoading &&
                <div className={"w-full h-full absolute left-0 top-0 bg-white-50 flex justify-center"}>
                <Image src={"/loading.svg"} alt={"로딩 중"} width={100} height={100}/>
                </div>
            }
            {
                state.isSelected &&
                <div className={"w-full h-full absolute left-0 top-0 bg-black-50 flex justify-center"}>
                </div>
            }
        </div>
    )
}

interface MainPosition {
    position: string
}

export function MainPosition({position}: MainPosition) {
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