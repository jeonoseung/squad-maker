
interface PlayerLevel {
    level:number
}

export default function PlayerLevel({ level }:PlayerLevel){
    const array = ['dark','bronze','bronze','bronze','sliver','sliver','sliver','gold','gold','gold']
    return (
        <span className={'block level'}>
            <span className={`${array[level-1]}`}>
                {level}
            </span>
        </span>
    )
}