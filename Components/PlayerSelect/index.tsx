import {useQuery} from "@tanstack/react-query";
import {Player, PlayerList} from "@/Utils/Type";
import {getPlayerList} from "@/Utils/API";
import Image from "next/image";

export default function PlayerSelect(){

    const { data,isLoading } = useQuery<PlayerList>({
        queryFn:getPlayerList,
        queryKey:["player-list"]
    })
    
    return (
        <div className={"fixed w-full h-full z-[1000] bg-white-50"}>
            <div className={"max-w-screen-md m-auto w-full h-full p-4"}>
                <div className={"grid gap-4"}>
                    {
                        isLoading 
                            ?
                            <div className={"min-h-[500px] flex justify-center items-center"}>
                                로딩 중....
                            </div>
                            :
                            data &&
                            data.players.map((li,index)=>(
                                <PlayerRow player={li} key={li.spid}/>
                            ))
                    }
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
interface PlayerRow {
    player:Player
}
function PlayerRow({ player }:PlayerRow){
    return (
        <div className={"bg-white border-2 border-gray-900 rounded-xl flex items-center p-4 gap-4 hover:cursor-pointer"}>
            <div
                className={"w-[35px] h-[35px] flex justify-center items-center rounded-full border-2 border-default bg-white text-black"}>
                {player.pay}
            </div>
            <div className={"w-[100px] h-auto"}>
                <Image src={player.img} alt={"선수 이미지"} width={100} height={100}/>
            </div>
            <div className={""}>
                <div className={"flex gap-1 text-black"}>
                    <Image src={player.season_img} alt={"시즌 아이콘"} width={30} height={15}/>
                    <span>{player.name}</span>
                    <MainPosition position={player.main_position}/>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}
interface MainPosition {
    position:string
}
function MainPosition({ position }:MainPosition){
    const split = position.split(",")
    if(split.length === 0){
        return (
            <span>-</span>
        )
    }
    
    return (
        split.map((li)=>{
            const [position,value] = li.split(" ")
            
            return (
                <p className={"flex gap-1"}>
                    <span className={`color-${position.toLowerCase()}`}>{position}</span>
                    <span>{value}</span>
                </p>
            )
        })
    )
}