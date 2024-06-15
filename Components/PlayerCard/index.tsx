import useSquadMaker from "@/Utils/Hook";
import {CardProps, Field, Player} from "@/Utils/Type";
import {CSSProperties, useEffect, useState} from "react";
import {DeleteUnit, SetPlayerStatus, SetPrice, SetPriceUnit} from "@/Utils/Function";
import Link from "next/link";
import Image from "next/image";



export default function PlayerCard({ index,player,position,level }:CardProps){
    
    const { 
        DragStart,
        Dragging,
        DragEnd,
        card,
        elementSize,
        SelectPlayerDelete
    } = useSquadMaker({
        index,position,player,level
    })
    
    const { current:size } = elementSize

    useEffect(() => {
        window.addEventListener("mousemove",Dragging)
        window.addEventListener("mouseup",DragEnd)
        return ()=>{
            window.removeEventListener("mousemove",Dragging)
            window.removeEventListener("mouseup",DragEnd)
        }
    }, []);

    const [state,setState] = useState<{style:CSSProperties,current:string}>({
        style:{
            left:'42%',
            top:'30%'
        },
        current:''
    })

    /**
     * 포메이션에 따른 위치 지정
     **/
    useEffect(()=>{
        const field = document.getElementsByClassName(position)[0]
        const fieldStyles = getComputedStyle(field)
        const left = DeleteUnit(fieldStyles.left) + (DeleteUnit(fieldStyles.width) /2) - (size.width / 2)
        const top = DeleteUnit(fieldStyles.top) + (DeleteUnit(fieldStyles.height) /2) - (size.height * 0.9)
        setState((prev)=>({
            ...prev,current:position.toUpperCase(),style:{left:`${left}px`,top:`${top}px`}
        }))
    },[position])

    return (
        player === null
            ?
            <div ref={card}
                 onMouseDown={DragStart}
                 className={`card in-${position}`}
                 style={state.style}
                // onMouseOver={cardSetState}
                 id={`squad-card-id-${index + 1}`}
            >
                <div className={'w-full h-full relative card-content'}>
                    <div className={`current-position empty-position`}>{state.current}</div>
                    <div
                        className={"absolute bg-black w-[60px] hover:w-[70px] h-[60px] hover:h-[70px] transition-all rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"}>
                        <p className={"absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[50%] h-[5px] bg-green-500"}></p>
                        <p className={"absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[5px] h-[50%] bg-green-500"}></p>
                    </div>
                </div>
            </div>
            :
            <div ref={card}
                 onMouseDown={DragStart}
                 className={`card in-${position} selected-card`}
                 style={{...state.style}}
                 id={`squad-card-id-${index + 1}`}
            >
                <Image src={player.card_img}
                       alt={'선수 배경 이미지'}
                       className={`select-bg-img`}
                       width={size.width}
                       height={size.height}
                />
                <div className={'absolute top-0 left-0 w-full h-full'}>
                    <div className={'w-full h-full relative card-content'}>
                        <div
                            className={`top text-orange-500`}>
                            <div
                                className={`status player-status`}>{SetPlayerStatus(position, player.ovr_set, level)}</div>
                            <div className={`current-position selected`}>{state.current}</div>
                            <div className={"playerCountry"}>
                                <Image src={player.country} alt={'선수 국가'} width={22} height={11}/>
                            </div>
                        </div>
                        <span className={"playerIcon"}>
                            <Image src={player.season_big_icon} alt={'시즌 빅 아이콘'} width={22} height={22}/>
                        </span>
                        <span className={"playerImg"}>
                            <Image src={player.img} alt={'선수 이미지'} width={110} height={110}/>
                        </span>
                        <span className={"player-level"}>
                            {/*<PlayerLevel level={level}/>*/}
                        </span>
                        <div className={"bottom"}>
                            <div className={'flex justify-center gap-1 items-center'}>
                                <div className={"playerClass"}>
                                    <Image src={player.season_img} alt={'시즌 이미지'} width={20} height={16}/>
                                </div>
                                <div className={`player-name overflow-hidden whitespace-nowrap`}>
                                    {player.name}
                                </div>
                            </div>
                            <div className={'flex justify-center'}>
                                <p className={"pay"}>
                                    {player.pay}
                                </p>
                            </div>
                        </div>
                        <div className={"absolute bottom-[-15px] bg-gray-800 flex justify-center items-center w-full whitespace-nowrap"}>
                            {SetPriceUnit(player.bp)} BP
                        </div>
                    </div>
                </div>
                <div className={"absolute top-0 left-0 w-full h-full"}>
                    
                </div>
            </div>
    )
}