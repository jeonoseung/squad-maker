import {atom} from "jotai";
import {CardState} from "@/Utils/Type";

export const _cardState:CardState[] = [
    { player:null, position:"st", level:1 },
    { player:null, position:"cf", level:1 },
    { player:null, position:"lm", level:1 },
    { player:null, position:"rm", level:1 },
    { player:null, position:"lcm", level:1 },
    { player:null, position:"rcm", level:1 },
    { player:null, position:"lb", level:1 },
    { player:null, position:"lcb", level:1 },
    { player:null, position:"rcb", level:1 },
    { player:null, position:"rb", level:1 },
    { player:null, position:"gk", level:1 },
]

export const cardState = atom<CardState[]>(_cardState)