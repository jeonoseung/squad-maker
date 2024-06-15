import {SquadState} from "@/Utils/Type";
import {atom} from "jotai";

export const _squadState:SquadState = {
    selectPosition:null,
    selectFormation:null
}

export const squadState = atom<SquadState>(_squadState)