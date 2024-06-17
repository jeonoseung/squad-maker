import {ReactNode} from "react";

export interface ChildProps {
    children?:ReactNode
}

export interface CardProps {
    player:Player | null
    index:number
    position:Field
    level:number
}

export interface ChangeCard {
    index:number
    target:Field
}

export interface ExchangeCard {
    index:number
    current:Field
    target:Field
}

export type Field = "gk" | 
    "sw" |
    "rwb" |
    "rb" |
    "rcb" |
    "cb" |
    "lcb" |
    "lb" |
    "lwb" |
    "rdm" |
    "cdm" |
    "ldm" |
    "rm" |
    "rcm" |
    "cm" |
    "lcm" |
    "lm" |
    "ram" |
    "cam" |
    "lam" |
    "rf" |
    "cf" | 
    "lf" |
    "rw" |
    "rs" |
    "st" |
    "ls" |
    "lw"

export interface Player {
    spid:number
    name:string
    img:string
    card_img:string
    season_img:string
    season_big_icon:string
    pay:number
    bp:string
    main_position:string
    main_status:string
    ovr_set:string
    country:string
}

export interface CardState {
    player:Player | null
    position:Field
    level:number
}

export interface SquadState {
    selectPosition:Field | null
    selectFormation:null
    selectIndex:number | null
    linkInput:string
}

export interface PlayerList {
    players:Player[]
}