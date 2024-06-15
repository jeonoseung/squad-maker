import {atom} from "jotai";
import {CardState} from "@/Utils/Type";

export const _cardState:CardState[] = [
    { player:null, position:"gk", level:1 },
    { player:{
        spid:100001397,
            name:"지네딘 지단",
            img:"https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersActionHigh/p100001397.png?rd=202405281030",
            card_img:"https://ssl.nexon.com/s2/game/fc/online/obt/externalAssets/card/ICONTM.png",
            season_img:"https://ssl.nexon.com/s2/game/fc/online/obt/externalAssets/season/ICONTM.png",
            season_big_icon:"https://ssl.nexon.com/s2/game/fc/online/obt/externalAssets/season/ICONTM_big.png",
            pay:33,
            bp:23000000000000,
            main_position:"CAM 124,LM 124,CM 123",
            main_status:`{"스피드":120,"슛":121,"패스":123,"드리블":130,"수비":103,"피지컬":119}`,
            ovr_set:`{"st":122,"lw":124,"cf":124,"rw":124,"cam":124,"lm":124,"cm":123,"rm":124,"cdm":115,"lwb":114,"cb":110,"rwb":114,"lb":111,"sw":109,"rb":111,"gk":44}`,
            country:"https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/countries/smallflags/18.png"
        }, position:"st", level:1 },
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