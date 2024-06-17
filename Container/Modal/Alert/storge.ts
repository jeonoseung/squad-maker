import {atom} from "jotai";
import {ReactNode} from "react";

export interface AlertModalState {
    display?:boolean
    onResult?:()=>void
    onCancel?:()=>void
    ResultText?:string
    CancelText?:string
    title?:ReactNode | string
    content?:ReactNode | string
    cancel?:boolean
}

export const _alertModalState:AlertModalState = {
    display:false,
    onResult:()=>{},
    onCancel:()=>{},
    ResultText:"확인",
    CancelText:"닫기",
    title:"",
    content:"",
    cancel:true
}

export const alertModalState = atom<AlertModalState>(_alertModalState)