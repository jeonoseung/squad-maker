import {atom} from "jotai";
import {CardState} from "@/Utils/Type";

export const _cardState:CardState[] = [
    { player:null, position:"gk", level:1 },
    { player:null, position:"st", level:1 },
    { player:null, position:"rwb", level:1 },
    { player:null, position:"rb", level:1 },
    { player:null, position:"rcb", level:1 },
    { player:null, position:"cb", level:1 },
    { player:null, position:"lcb", level:1 },
    { player:null, position:"lb", level:1 },
    { player:null, position:"lwb", level:1 },
    { player:null, position:"rdm", level:1 },
    { player:null, position:"cdm", level:1 }
]

export const cardState = atom<CardState[]>(_cardState)