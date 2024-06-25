import {useAtomValue} from "jotai/index";
import {cardState} from "@/Utils/Storage/Card";
import {squadState} from "@/Utils/Storage/Squad";
import {useMemo} from "react";
import {MaxPay} from "@/Utils/Data";
import {CheckFieldType, SetPlayerStatus, SetPriceUnit} from "@/Utils/Function";

export default function SquadInfo(){

    const state_card = useAtomValue(cardState)
    const state_squad = useAtomValue(squadState)
    
    const info = useMemo(()=>{
        return state_card.reduce((sum,li,index)=>{
            if(li.player){
                const copy = { ...sum }
                copy.pay += li.player.pay
                copy.bp += li.player.bp.split(",").map(Number)[li.level-1]
                copy.length++
                const type = CheckFieldType(li.position)
                const status = SetPlayerStatus(li.position, li.player.ovr_set, li.level, state_squad.adapted)
                if(type === "FW"){
                    copy.fw += status
                    copy.fw_length++
                }
                else if(type === "MF"){
                    copy.mf += status
                    copy.mf_length++
                }
                else if(type === "DF"){
                    copy.df += status
                    copy.df_length++
                }
                return copy
            }
            else {
                return sum
            }
        },{ pay:0,bp:0,length:0,fw:0,mf:0,df:0,fw_length:0,mf_length:0,df_length:0 })
    },[state_card])
    
    const SetAverage = (i:number,j:number) =>{
        if(i === 0 || j === 0){
            return 0
        }
        else {
            return Math.floor(i / j)
        }
    }
    return (
        <div className={"grid grid-cols-12 m-auto w-full max-w-screen-xl text-white rounded-lg bg-gray-800"}>
            <div className={"col-span-2 flex flex-col justify-center items-center gap-3 py-6"}>
                <span>총 급여</span>
                <p className={"text-xl font-bold"}>
                    {
                        info.pay > MaxPay
                            ? <span>
                                <span className={"text-red-500"}>{info.pay}</span> 
                                / {MaxPay}
                              </span>
                            : <span>{info.pay} / {MaxPay}</span>
                    }
                </p>
            </div>
            <div className={"col-span-4 flex flex-col justify-center items-center gap-3 py-6"}>
                <span>총 시세</span>
                <p className={"text-xl font-bold"}>
                    {SetPriceUnit(info.bp)} BP
                </p>
            </div>
            <div className={"col-span-4 flex flex-col justify-center items-center gap-3 py-6"}>
                <span>평균 능력치</span>
                <div className={"flex gap-2"}>
                    <p className={"text-red-500 flex gap-1"}>
                        <span>FW</span>
                        <span>{SetAverage(info.fw,info.fw_length)}</span>
                    </p>
                    <p className={"text-green-500 flex gap-1"}>
                        <span>MF</span>
                        <span>{SetAverage(info.mf,info.mf_length)}</span>
                    </p>
                    <p className={"text-blue-500 flex gap-1"}>
                        <span>DF</span>
                        <span>{SetAverage(info.df,info.df_length)}</span>
                    </p>
                </div>
            </div>
            <div className={"col-span-2 flex flex-col justify-center items-center gap-3 py-6"}>
                <span>인원</span>
                <p className={"text-xl font-bold"}>
                    {info.length}
                </p>
            </div>
        </div>
    )
}