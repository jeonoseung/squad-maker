import Image from "next/image";
import React, {ChangeEvent, useState} from "react";
import {useAtom, useSetAtom} from "jotai/index";
import {squadState} from "@/Utils/Storage/Squad";

export default function PlayerSearch(){
    const setState_squad = useSetAtom(squadState)
    const [ state,setState ] = useState({
        isLoading:false,
        input:""
    })
    const changeInput = (e:ChangeEvent<HTMLInputElement>) =>{
        setState((prev)=>({
            ...prev,
            input:e.target.value
        }))
    }
    
    const searchStart = () =>{
        setState_squad((prev)=>({
            ...prev,
            searchInput:state.input
        }))
    }

    const keyup = (e:React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === "Enter"){
            searchStart()
        }
    }
    
    return (
        <div className={""}>
            <div className={"flex gap-2 items-center"}>
                <span className={"whitespace-nowrap text-blue-500 font-bold"}>검색</span>
                <input
                    type={"text"}
                    placeholder={"선수 명을 입력해 주세요."}
                    value={state.input}
                    onChange={changeInput}
                    className={"w-full px-1 py-0.5 border-none rounded disabled:bg-gray-300"}
                    disabled={state.isLoading}
                    spellCheck={"false"}
                    onKeyUp={keyup}
                    onFocus={(e) => e.target.select()}
                />
                {
                    state.isLoading
                        ?
                        <button
                            className={"relative whitespace-nowrap px-4 py-1 bg-blue-700 text-white rounded text-sm overflow-hidden text-transparent"}>
                            <Image className={"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}
                                   src={"/loading.svg"} alt={"로딩 중..."} width={30} height={30}/>
                            검색
                        </button>
                        :
                        <button className={"whitespace-nowrap px-4 py-1 bg-blue-500 text-white rounded text-sm"}
                                onClick={searchStart}>
                            검색
                        </button>
                }
                {/*<button className={"whitespace-nowrap px-4 py-1 bg-black text-white rounded text-sm"}*/}
                {/*        onClick={clickHelp}>*/}
                {/*    설명*/}
                {/*</button>*/}
            </div>
        </div>
    )
}