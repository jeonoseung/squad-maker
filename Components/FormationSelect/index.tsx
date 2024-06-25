import React, {ChangeEvent, useMemo, useState} from "react";
import {FormationList} from "@/Utils/Data";
import {Field} from "@/Utils/Type";
import {useSetAtom} from "jotai/index";
import {cardState} from "@/Utils/Storage/Card";
import {useAtom} from "jotai";
import {squadState} from "@/Utils/Storage/Squad";

export default function FormationSelect(){
    const setState_card = useSetAtom(cardState)
    const [ state_squad,setState_squad ] = useAtom(squadState)
    const [ state,setState ] = useState({
        formation:"4-4-2",
        input:""
    })
    
    const changeInput = (e:ChangeEvent<HTMLInputElement>) =>{
        setState((prev)=>({
            ...prev,
            input:e.target.value
        }))
    }
    
    const f = useMemo(()=>{
        return FormationList.filter((li)=>li.name.includes(state.input))
    },[state.input])
    
    const clickFormation = (name:string,formation:Field[]) =>{
        setState((prev)=>({
            ...prev,
            formation:name,
            input:""
        }))
        setState_card((prev)=>{
            const c = [ ...prev ]
            return c.map((li, index) => {
                if(li.position !== "gk"){
                    const p:Field = formation[index]
                    return {
                        ...li,
                        position:p
                    }
                }
                else {
                    return li
                }
            })
        })
    }
    
    const changeAdapted = (e:ChangeEvent<HTMLSelectElement>) =>{
        const parse = parseInt(e.target.value)
        setState_squad((prev)=>({
            ...prev,
            adapted:isNaN(parse) ? 1 : parse
        }))
    }
    
    return(
        <div className={"w-full max-w-screen-md m-auto grid grid-cols-2 bg-gray-800 mt-12 p-4 items-center rounded-lg"}>
            <div className={"grid grid-cols-2 gap-1"}>
                <div className={" text-white font-bold text-xl text-center"}>
                    {state.formation}
                </div>
                <div className={"w-full relative"}>
                    <input
                        type={"text"}
                        placeholder={"4-4-2"}
                        value={state.input}
                        onChange={changeInput}
                        className={"w-full px-1 py-0.5 border-none rounded disabled:bg-gray-300"}
                        spellCheck={"false"}
                        onFocus={(e) => e.target.select()}
                    />
                    {
                        state.input.length > 0 &&
                        <ul className={"rounded absolute left-0 top-[105%] bg-white w-full z-[150] overflow-auto max-h-[350px]"}>
                            {
                                f.map((li) => (
                                    <li className={"w-full p-1 border-b last:border-none hover:bg-gray-100 hover:cursor-pointer"}
                                        onClick={() => clickFormation(li.name, li.position)}
                                        key={li.name}
                                    >
                                        {li.name}
                                    </li>
                                ))
                            }
                        </ul>
                    }
                </div>
            </div>
            <div className={"grid grid-cols-2 gap-1"}>
                <div className={" text-white font-bold text-xl text-center"}>
                    적응도
                </div>
                <select 
                    className={"w-full px-1 py-0.5 border-none rounded disabled:bg-gray-300"}
                    value={state_squad.adapted}
                    onChange={changeAdapted}
                >
                    {
                        [1,2,3,4,5].map((li)=> (
                            <option key={li} value={li}>{li}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}