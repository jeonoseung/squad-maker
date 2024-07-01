"use client"
import "./style.css"
import Main from "@/Container/Main";
import {FieldList} from "@/Utils/Data";
import {cardState} from "@/Utils/Storage/Card";
import {useAtom, useAtomValue} from "jotai";
import PlayerCard from "@/Components/PlayerCard";
import PlayerSelect from "@/Components/PlayerSelect";
import {squadState} from "@/Utils/Storage/Squad";
import AlertModal from "@/Container/Modal/Alert";
import SquadInfo from "@/Components/SquadInfo";
import FormationSelect from "@/Components/FormationSelect";
import {useEffect} from "react";
import {GetPlayerBP, PuppeteerLaunch} from "@/Utils/Function/API";
import {sleep} from "@/Utils/Function";



export default function SquadMakerPage(){
    
    const state_card = useAtomValue(cardState)
    const state_squad = useAtomValue(squadState)
    
    return (
        <Main>
            <div className={"bg-gray-900 py-12"}>
                {
                    state_squad.selectPosition && typeof state_squad.selectIndex === "number" &&
                    <PlayerSelect/>
                }
                <SquadInfo/>
                <FormationSelect/>
                <div className={"py-[150px]"}>
                    <div className={"ground"}>
                        <div
                            className={'relative w-[65%] h-[80%] -translate-x-1/2 left-1/2 top-[5%] field'}>
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
            </div>
        </Main>
    )
}