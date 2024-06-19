import useAlertModal from "@/Container/Modal/Alert/hook";
import Link from "next/link";
import React, {ChangeEvent, useRef, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postPlayer} from "@/Utils/API";
import {AxiosError} from "axios";
import {useAtom} from "jotai/index";
import {squadState} from "@/Utils/Storage/Squad";
import Image from "next/image";
import {ErrorMessage} from "@/Utils/Function";

export default function PlayerAdd(){

    const [ state_squad, setState_squad ] = useAtom(squadState)
    const [ state,setState ] = useState({
        isLoading:false
    })
    const changeInput = (e:ChangeEvent<HTMLInputElement>) =>{
        setState_squad((prev)=>({
            ...prev,
            linkInput:e.target.value
        }))
    }
    const qc = useQueryClient()

    const { AlertStart } = useAlertModal()
    const clickHelp = () =>{
        AlertStart({
            title:"링크 붙여넣기",
            content:(
                <div className={""}>
                    <ul className={"list-decimal list-inside"}>
                        <li>
                            <Link
                            href={"https://fconline.nexon.com/datacenter"}
                            className={"underline text-blue-500 whitespace-nowrap"}
                            target={"_blank"}
                            >
                                선수 목록
                            </Link>
                            에서 원하는 선수를 확인
                        </li>
                        <li>
                            원하는 선수의 돋보기 버튼을 눌러 선수 상세 정보 페이지로 이동
                        </li>
                        <li>
                            페이지 링크를
                            <span className={"text-green-500 font-bold mx-1"}>링크</span>
                            입력란에 복사 붙여넣기
                        </li>
                    </ul>
                    <p className={"w-full flex flex-col"}>
                        <span className={"text-green-500 font-bold"}>링크 입력 값 예시</span>
                        <Link className={"underline text-blue-500"}
                              href={"https://fconline.nexon.com/DataCenter/PlayerInfo?spid=100190043&n1Strong=1)"}
                              target={"_blank"}
                        >
                            https://fconline.nexon.com/DataCenter/PlayerInfo?spid=100190043&n1Strong=1
                        </Link>
                    </p>
                </div>
            )
        })
    }
    const check = useRef<boolean>(false)
    const { mutate } = useMutation({
        mutationFn:postPlayer,
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
            },500)
            setState((prev)=>({
                ...prev,
                isLoading: false
            }))
        },
        onError:(error:AxiosError)=>{
            ErrorMessage(error,"선수 추가 처리가 실패했습니다.")
        },
        onSuccess:()=>{
            alert("선수가 추가되었습니다.")
            qc.invalidateQueries()
            setState_squad((prev)=>({
                ...prev,
                linkInput:""
            }))
        }
    })
    
    const keyup = (e:React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === "Enter"){
            clickAdd()
        }
    }

    const clickAdd = () =>{
        const value = state_squad.linkInput
        if(check.current){
            
        }
        else if(value.length === 0){
            alert("링크를 입력해 주세요.")
        }
        else if(!value.includes("https://fconline.nexon.com/DataCenter/PlayerInfo")){
            alert("링크를 다시 확인해 주세요.")
        }
        else {
            const url = new URL(value)
            const pid_string = url.searchParams.get("spid")
            if(pid_string === null){
                alert("선수를 확인할 수 없습니다.")
            }
            const pid = Number(pid_string)
            if(isNaN(pid)){
                alert("링크 값이 올바르지 않습니다.")
            }
            mutate({ pid })
        }
    }
    
    return (
        <div className={""}>
            <div className={"flex gap-2 items-center"}>
                <span className={"whitespace-nowrap text-green-500 font-bold"}>링크</span>
                <input
                    type={"text"}
                    placeholder={"피파 선수 상세 정보에서 링크를 복사 후 입력란에 붙여넣기 해주세요."}
                    value={state_squad.linkInput}
                    onChange={changeInput}
                    className={"w-full px-1 py-0.5 border-none rounded disabled:bg-gray-300"}
                    disabled={state.isLoading}
                    spellCheck={"false"}
                    onKeyUp={keyup}
                />
                {
                    state.isLoading
                        ?
                        <button className={"relative whitespace-nowrap px-4 py-1 bg-green-700 text-white rounded text-sm overflow-hidden text-transparent"}>
                            <Image className={"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"} src={"/loading.svg"} alt={"로딩 중..."} width={30} height={30}/>
                            추가
                        </button>
                        :
                        <button className={"whitespace-nowrap px-4 py-1 bg-green-500 text-white rounded text-sm"}
                                onClick={clickAdd}>
                            추가
                        </button>
                }
                <button className={"whitespace-nowrap px-4 py-1 bg-black text-white rounded text-sm"}
                        onClick={clickHelp}>
                    설명
                </button>
            </div>
        </div>
    )
}