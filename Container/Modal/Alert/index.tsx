"use client"
import useAlertModal from "@/Container/Modal/Alert/hook";
import React, {useEffect} from "react";

export default function AlertModal(){
    
    const { AlertEnd,state } = useAlertModal()
    
    const ClickOutSide = (e:React.MouseEvent<HTMLDivElement>) =>{ 
        if(e.target === e.currentTarget && state.display){
            AlertEnd()
        }
    }

    const KeyUP_ESC = (e:KeyboardEvent) =>{
        if(e.key === "ESC" && state.display){
            AlertEnd()
        }
    }
    
    useEffect(() => {
        document.addEventListener("keyup",KeyUP_ESC)
        return ()=>{
            window.removeEventListener("keyup",KeyUP_ESC)
        }
    }, []);
    
    const ClickClose = () =>{
        state.onCancel && state.onCancel()
        AlertEnd()
    }
    
    const clickResult = () =>{
        state.onResult && state.onResult()
        AlertEnd()
    }
    
    return (
        state.display &&
        <div className={"fixed left-0 top-0 bg-transparent z-[1001] w-full h-full"} onClick={ClickOutSide}>
            <div className={"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}>
                <div className={"bg-white p-4 flex flex-col gap-4 shadow-xl w-[450px]"}>
                    <div className={"flex justify-between"}>
                        <div className={"font-bold text-black text-base"}>{state.title}</div>
                        <button className={"text-red-500"} onClick={AlertEnd}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                            </svg>
                        </button>
                    </div>
                    <div>
                        {state.content}
                    </div>
                    <div className={"flex justify-between"}>
                        {
                            state.cancel &&
                            <button onClick={ClickClose} className={"text-red-500"}>
                                {state.CancelText}
                            </button>
                        }
                        <button onClick={clickResult} className={"text-blue-500"}>
                            {state.ResultText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}