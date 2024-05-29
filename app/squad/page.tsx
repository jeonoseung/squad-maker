"use client"
import "./style.css"
import Main from "@/Container/Main";
import {FieldList} from "@/Utils/Data";

export default function SquadMakerPage(){
    return (
        <Main>
            <div className={"ground"}>
                <div className={"card-wrap"}>
                    
                </div>
                <div className={"field-wrap"}>
                    {
                        FieldList.map((li)=>(
                            <div className={`${li}`}>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Main>
    )
}