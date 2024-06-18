import {Player} from "@/Utils/Type";
import React, {ChangeEvent, useRef, useState} from "react";
import {useAtom} from "jotai/index";
import {cardState} from "@/Utils/Storage/Card";
import {squadState} from "@/Utils/Storage/Squad";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchPlayerBP} from "@/Utils/API";
import {AxiosError} from "axios";
import {CheckBPRefresh, ErrorMessage, SetBP, SetTimeAgo} from "@/Utils/Function";
import Image from "next/image";
import {LevelArray} from "@/Utils/Data";

interface PlayerRow {
    player:Player
}
export function PlayerRow({ player }:PlayerRow){
    const check = useRef<boolean>(false)
    const [ state_card,setState_card ] = useAtom(cardState)
    const [ state_squad, setState_squad ] = useAtom(squadState)
    const [state,setState] = useState({
        level:1,
        isLoading:false
    })
    const qc = useQueryClient()

    const clickRow = () =>{
        const { selectIndex,selectPosition } = state_squad
        const isGK = state_card.some((li)=>li.player?.main_position.includes("GK"))
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
        onSuccess:()=>{
            qc.invalidateQueries()
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

    return (
        <div className={"relative bg-white overflow-hidden hover:bg-gray-200 border-2 border-gray-900 rounded-xl flex items-center p-4 gap-4 hover:cursor-pointer"} onClick={clickRow}>
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
                    <p className={"flex gap-0.5"}>
                        <span className={"font-medium"}>
                            {SetBP(player.bp, state.level)} BP
                        </span>
                        {
                            CheckBPRefresh(player.bp_update_time)
                                ?
                                <button className={`hover:text-green-500 transition-colors duration-500`}
                                        onClick={clickRefreshBP}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                         width="20px"
                                         fill="currentColor">
                                        <path
                                            d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
                                    </svg>
                                </button>
                                :
                                <button className={`text-gray-300`} onClick={clickRefreshBP}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                         width="20px"
                                         fill="currentColor">
                                        <path
                                            d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
                                    </svg>
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