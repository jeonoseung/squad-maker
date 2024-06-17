import {Field} from "@/Utils/Type";
export const GetDateTimeNow = () =>{
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2,"0")
    const day = String(date.getDate()).padStart(2,"0")
    const hour = String(date.getHours()).padStart(2,"0")
    const min = String(date.getMinutes()).padStart(2,"0")
    const sec = String(date.getSeconds()).padStart(2,"0")
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}
export const SetBP = (bp:string,level:number) =>{
    const split = bp.split(",").map(Number)
    return SetPriceUnit(split[level-1])
}
export const SetPrice = (value: string | number) => {
    const result = `${value}`;
    return result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const SetPriceUnit = (value: number) => {
    if(value === 0){
        return 0
    }
    let price = value;
    const man = 10000;

    const eog = man * man;
    const jo = eog * man;
    const kyung = jo * man;
    const hae = kyung * man;

    const unit = [
        { text: "해", value: hae },
        { text: "경 ", value: kyung },
        { text: "조 ", value: jo },
        { text: "억 ", value: eog },
        { text: "만 ", value: man },
        { text: " ", value: 1 },
    ];
    return unit.reduce((sum, { text, value }, index) => {
        const share = Math.floor(price / value);
        price = price % value;
        if (share === 0) {
            return sum;
        } else {
            return `${sum}${share}${text}`;
        }
    }, "");
};

/** Element 를 지정한 위치로 이동 */
export const ChangeLocation = (element:HTMLElement,location:{x:number,y:number}) => {
    element.style.top = `${location.y}px`;
    element.style.left = `${location.x}px`;
}

/** 필드 밖으로 나갔을 때 해당 필드는 배경색 초기화 */
export const LeaveField = (elem:HTMLElement) => {
    elem && (elem.style.background = '')
}

/** 객체 top,left int값으로 돌려받기 */
export const ReturnXY = (element:HTMLElement) => {
    const [top] = element.style.top.split('px')
    const [left] = element.style.left.split('px')
    const x = parseInt(left)
    const y = parseInt(top)
    return {x,y}
}
/** unit 값 제거 후 int 값으로 돌려받기 */
export const DeleteUnit = (value:string,unit:string='px') => {
    const [split] = value.split(unit);
    return parseInt(split)
}

/** 만약 카드가 여러장 또는 텍스트가 겹쳐 있을 경우를 대비하여 아래 element가 필드일 때까지 숨김처리 반복 */
export const FindField = (element:HTMLElement,x:number,y:number,e:MouseEvent) =>{

    let el = element;
    function findStart(){
        let returnSave = []
        let max = 0;
        while(true){
            if(max > 10 || el === null) break;
            if(el.classList.contains('position')) {
                break;
            }
            else{
                const copy = el;
                copy.hidden = true;
                el = document.elementFromPoint(x,y) as HTMLElement
                returnSave.push(copy)
            }
            max++

        }
        return returnSave
    }
    /**
     * 위 아래로 드래그 후 마우스 갖다대면 오류 나서 추가해뒀는데
     * 버그 1번 해결 후 없애도 상관없어서 주석처리
     **/
        // if(e.clientY < 50 || e.clientY > window.innerHeight-250) return null
    const array = findStart()
    /** 숨김처리한 element들 다시 표시 */
    array.map((li)=>li.hidden = false)
    if(el === null || !el.classList.contains('position')){
        return null
    }
    return el
}
export const SumStatusByLevel = (level:number) => {
    const growthStatus = [0,1,1,2,2,2,3,4,4,5]
    let sum = 0;
    for(let i =0;i<growthStatus.length;i++) {
        sum += growthStatus[i]
        if(i === level -1){
            break;
        }
    }
    return sum
}
export const SetPlayerStatus = (position:Field | null,ovr:string , level:number) =>{
    const ovr_object = JSON.parse(ovr)
    let value = null
    switch (position){
        case 'st':
        case 'ls':
        case 'rs':
            value = ovr_object['st'];
            break;
        case 'cf':
        case 'lf':
        case 'rf':
            value = ovr_object['cf'];
            break;
        case 'cam':
        case 'lam':
        case 'ram':
            value = ovr_object['cam'];
            break;
        case 'cm':
        case 'lcm':
        case 'rcm':
            value = ovr_object['cm'];
            break;
        case 'cdm':
        case 'ldm':
        case 'rdm':
            value = ovr_object['cdm'];
            break;
        case 'cb':
        case 'lcb':
        case 'rcb':
            value = ovr_object['cb'];
            break
        case 'lw':
        case 'rw':
        case 'lm':
        case 'rm':
        case 'lwb':
        case 'rwb':
        case 'lb':
        case 'sw':
        case 'gk':
        case 'rb':
            value = ovr_object[position];
            break;
        default:
            value = '1004'
    }
    const sum = SumStatusByLevel(1)
    return parseInt(value) + sum;
}
