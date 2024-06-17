import {useState} from "react";
import {_alertModalState, AlertModalState, alertModalState} from "@/Container/Modal/Alert/storge";
import {useAtom} from "jotai";

export default function useAlertModal(){
    
    const [ state,setState ] = useAtom(alertModalState)
    
    const AlertStart = (parameter:AlertModalState) =>{
        setState((prev)=>({
            ...prev,
            ...parameter,
            display:true
        }))
    }
    
    const AlertEnd = () =>{
        setState(_alertModalState)
    }
    
    return {
        AlertStart,
        AlertEnd,
        state
    }
}