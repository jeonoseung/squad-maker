import {ChangeEvent, useRef, useState} from "react";

interface PlayerLevel {
    level:number
}
const array = ['dark','bronze','bronze','bronze','sliver','sliver','sliver','gold','gold','gold']
export function PlayerLevel({ level }:PlayerLevel){
    return (
        <span className={'block level'}>
            <span className={`${array[level-1]}`}>
                {level}
            </span>
        </span>
    )
}
interface SelectPlayerLevel {
    click:(level:number)=>void
}
export function SelectPlayerLevel({ click }:SelectPlayerLevel){
    
    const label = useRef<HTMLLabelElement>(null)
    
    const clickLevelButton = (level:number) =>{
        click(level)
        if(label.current){
            label.current.click()
        }
    }
    
    return (
        <div className={"relative"}>
            <label className={"level-wrap hover:cursor-pointer"} ref={label}>
                <input type={"checkbox"} className={"hidden"}/>
                <span>레벨</span>
                <div className={"level-select hidden absolute left-0 top-full"}>
                    {
                        array.map((li, index) => (
                            <button className={'level'} key={`${li}-${index}`} onClick={() => clickLevelButton(index+1)}>
                                <span className={`${li}`}>
                                    {index + 1}
                                </span>
                            </button>
                        ))
                    }
                </div>
            </label>
        </div>
    )
}