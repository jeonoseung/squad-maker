"use client"
import "./style.css"
import Main from "@/Container/Main";
import {FieldList} from "@/Utils/Data";
import {cardState} from "@/Utils/Storage/Card";
import {useAtom} from "jotai";
import PlayerCard from "@/Components/PlayerCard";
import PlayerSelect from "@/Components/PlayerSelect";
import {squadState} from "@/Utils/Storage/Squad";



export default function SquadMakerPage(){
    
    const [ state_card,setState_card ] = useAtom(cardState)
    const [ state_squad, setState_squad ] = useAtom(squadState)

    return (
        <Main>
            {
                state_squad.selectPosition && typeof state_squad.selectIndex === "number" &&
                <PlayerSelect/>
            }
            <div className={"py-[150px] bg-gray-900"}>
                <div className={"ground"}>
                    <div
                        className={'relative w-[65%] h-[80%] border border-red-500 -translate-x-1/2 left-1/2 top-[5%] field'}>
                        <div>
                            {
                                state_card.map((li, index) => (
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