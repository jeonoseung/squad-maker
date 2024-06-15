"use client"
import "./style.css"
import Main from "@/Container/Main";
import {FieldList} from "@/Utils/Data";
import {cardState} from "@/Utils/Storage/Card";
import {useAtom} from "jotai";
import PlayerCard from "@/Components/PlayerCard";
import {useQuery} from "@tanstack/react-query";
import {getPlayerList} from "@/Utils/API";
import {PlayerList} from "@/Utils/Type";
import PlayerSelect from "@/Components/PlayerSelect";



export default function SquadMakerPage(){
    
    const [ state,setState ] = useAtom(cardState)
    
   

    return (
        <Main>
            <PlayerSelect/>
            <div className={"py-[150px] bg-gray-900"}>
                <div className={"ground"}>
                    <div
                        className={'relative w-[65%] h-[80%] border border-red-500 -translate-x-1/2 left-1/2 top-[5%] field'}>
                        <div>
                            {
                                state.map((li, index) => (
                                    <PlayerCard key={index} player={li.player} index={index} level={li.level} position={li.position}/>
                                ))
                            }
                        </div>
                        <div className={"field-wrap"}>
                            {
                                FieldList.map((li, index) => (
                                    <div className={`${li} position`} key={`${li}-${index}`}>
                                        {li.toUpperCase()}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    )
}