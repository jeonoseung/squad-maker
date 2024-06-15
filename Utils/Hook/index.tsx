import {useAtom} from "jotai";
import {useRef} from "react";
import {CardProps, ChangeCard, ExchangeCard, Field} from "@/Utils/Type";
import {squadState} from "@/Utils/Storage/Squad";
import {ChangeLocation, DeleteUnit, FindField, LeaveField, ReturnXY} from "@/Utils/Function";
import {cardState} from "@/Utils/Storage/Card";
import {FieldList} from "@/Utils/Data";

export default function useSquadMaker({ player,index,position }:CardProps){
    /** 스쿼드 카드 상태 값 */
    const [ state_card,setState_card ] = useAtom(cardState)
    /** 스쿼드 맵 상태 값 */
    const [ state_squad,setState_squad ] = useAtom(squadState)
    /** 드래그 상태 값 */
    const dragging = useRef<boolean>(false)
    /** 카드 element */
    const card = useRef<HTMLDivElement | null>(null)
    /** 시작 위치 저장 */
    const startPoint = useRef<{clientX:number,pageY:number}>({clientX:0,pageY:0})
    /** 시작 필드 */
    const startField = useRef<string | null>(null)
    /** 시작 위치 저장 */
    const savePoint = useRef<{top:number,left:number}>({top:0,left:0})
    /** 드래그 하면서 마우스 이동 시 해당 변수에 필드 element 저장 */
    const underElement = useRef<HTMLElement | null>(null)
    /** 카드 크기 */
    const elementSize = useRef({
        width:130,
        height:210
    })
    const { current:size } = elementSize
    const DragStart = (e:React.MouseEvent<HTMLDivElement>) =>{
        if(!card.current || !player) {
            return 
        }
        /** 객체의 top,left를 number값으로 리턴 */
        const {x,y} = ReturnXY(card.current)
        /**
         * 현재 top,left 저장
         * 위치 변경을 위해 저장
         * */
        savePoint.current.top = y
        savePoint.current.left = x
        /**
         * 시작한 지점과 현재 마우스 포인트 값 차이를 구하기 위해 저장
         * */
        startPoint.current.clientX = e.clientX;
        startPoint.current.pageY = e.pageY;
        /** 시작 필드 설정 */
        startField.current = position;
        /** 드래그 상태 값 ON */
        dragging.current = true
        card.current.classList.toggle("opacity-75")
    }
    const SelectPlayerDelete = (index:number) =>{
        setState_card((prev)=>{
            const result = prev.map((li,i)=>{
                const copy = { ...li }
                if(i === index){
                    copy.player = null
                }
                return copy
            })
            return { ...prev,playerList:result }
        })
    }
    const ChangeCardPosition = ({ index, target }:ChangeCard) =>{
        setState_card((prev)=>{
            return prev.map((li, i) => {
                const copy = {...li}
                copy.position = index === i ? target : li.position
                return copy
            })
        })
    }
    const ExchangeCardPosition = ({index, current, target }:ExchangeCard) =>{
        setState_card((prev)=>{
            return prev.map((li, i) => {
                const copy = {...li}
                if (index === i) {
                    copy.position = target;
                } else {
                    copy.position === target
                        ? copy.position = current
                        : copy.position = li.position
                }
                return copy
            })
        })
    }
    /** 드래그 후 이동 시 카드 아래 Field 를 지정한 배경색과 포지션을 변경 */
    function EnterField(elem:HTMLElement) {
        if(elem){
            elem.style.background = "rgba(255,255,255,0.25)";
            if(!card.current) return
            const positionText = card.current.querySelector('.current-position');
            if(!positionText) return;
            positionText.innerHTML = elem.classList[0].toUpperCase()
            const target = elem.classList[0] as Field
            ChangeCardPosition({ index,target })
        }
    }
    
    const Dragging = (e:MouseEvent) =>{
        if(!dragging.current || !card.current || card.current?.classList.contains("gk")) {
            return
        }
        /** element의 width,height값 */
        const {width,height,x,y} = card.current.getBoundingClientRect()
        /** 저장한 위치 값 */
        const {top,left} = savePoint.current
        /** 현재 화면의 마우스 포인터 위치 */
        const {clientX,clientY,pageY} = e
        /** 현재 화면의 마우스 포인터 위치 - 드래그 시작 지점 */
        const distanceX:number = clientX - startPoint.current.clientX
        const distanceY:number = pageY - startPoint.current.pageY
        /** 최종적으로 이동할 위치 */
        const totalX:number = left+distanceX
        const totalY:number = top+distanceY
        const field = document.getElementsByClassName('field')[0]
        /**
         * y축이 특정 지점을 벗어나지 않게 설정
         * if - top 제한
         * else if - bottom 제한
         * else - 구한 값의 위치로 이동
         **/
        if(totalY < (size.height-30)*-1) card.current.style.top = `-${size.height-30}px`
        else if(totalY > field.clientHeight-height) card.current.style.top = `${field.clientHeight-height}px`
        else card.current.style.top = `${totalY}px`
        /**
         * x축이 특정 지점을 벗어나지 않게 설정
         * if - left 제한
         * else if - right 제한
         * else - 구한 값의 위치로 이동
         **/
        if(totalX < 0) card.current.style.left = `0`
        else if(totalX > field.clientWidth-width) card.current.style.left = `${field.clientWidth-width}px`
        else card.current.style.left = `${totalX}px`
        /** 현재 드래그 중인 카드 숨김 처리 현재 필드가 어디인지 확인 하기 위해 */
        card.current.hidden = true
        /** 포인터 위치의 element 가져오기 */
        const _X = Math.floor( x+(width/2))
        const _Y = Math.floor(y+(height * 0.9))
        let pointElement:HTMLElement | null = document.elementFromPoint(_X, _Y) as HTMLElement
        /**
         * 만약 필드가 아닌 카드 일시 해당 카드를 숨김 처리하고 다시 시도
         * 해당 부분은 두번이상 겹칠 때도 있는데 필요 시 한번 더 시도하게 변경
         * */
        pointElement = FindField(pointElement,_X,_Y,e)
        /** 카드 숨김 해제 */
        card.current.hidden = false
        /** 만약 element가 없으면 리턴 */
        if (!pointElement) return
        /** 무엇을 위한 작업인지 확인 필요 */
        const droppableBelow = pointElement.closest(`.`+pointElement.classList[0]) as HTMLElement
        /**
         * 불필요한 반복작업을 줄이기 위해 조건문 사용
         **/
        if (underElement.current != droppableBelow){
            /** 해당 필드 배경색 초기화 */
            underElement.current &&
            LeaveField(underElement.current)
            underElement.current = droppableBelow;
            /** 해당 필드 배경색 설정 */
            underElement.current &&
            EnterField(underElement.current)
        }
    }
    const DragEnd = () => {
        /** 드래그 상태일때만,지정한 객체가 있을 때만 */
        if(!dragging.current || !card.current) return
        /** undrag 상태로 변경 */
        dragging.current = false
        /** 필드 배경색 초기화 */
        underElement.current && LeaveField(underElement.current)
        /** 현재 카드가 있는 필드의 클래스 값만 리턴 */
        const [cl] = FieldList.filter((li)=>
            card.current && card.current.classList.contains(`in-${li}`) && li
        )
        const selected = card.current.classList.contains('selected-card') ? 'selected-card' : ''
        /** 카드의 클래스 명 초기화 */
        underElement.current && (card.current.className = `card ${selected}`)
        card.current.classList.toggle("opacity-75")
        /**
         * 마우스를 움직여 저장한 필드가 있고 저장한 element가 필드가 아닐 시
         * 이 부분은 저장한 필드가 있는지만 확인하면 됨. 혹시나 해서 이중으로 확인
         **/
        if(underElement.current && !underElement.current.classList.contains('card')){
            /** 현재 마우스 포인트가 있는 필드 가져오기 */
            const field = underElement.current
            /** 드래그 중인 카드가 있던 필드 클래스 */
            const get = document.getElementsByClassName(cl)[0]
            /** 드래그 중이던 카드가 원래 있던 필드 */
            const A = getComputedStyle(get)
            /** 카드를 놓은 필드 */
            const B = getComputedStyle(field)
            /** 카드의 rect값 */
            const thisRect = card.current.getBoundingClientRect()
            /**
             * X = left
             * Y = top
             * */
            const AX = DeleteUnit(A.left) + (DeleteUnit(A.width)/2) - (thisRect.width / 2)
            const AY = DeleteUnit(A.top) + (DeleteUnit(A.height)/2) - (thisRect.height * 0.9)
            const BX = DeleteUnit(B.left) + (DeleteUnit(B.width)/2) - (thisRect.width / 2)
            const BY = DeleteUnit(B.top) + (DeleteUnit(B.height)/2) - (thisRect.height * 0.9)
            /**
             * 드래그했던 카드를 현재 필드에 놓고 필드 클래스를 부여하기 전에 그 필드에 카드가 있는지 확인
             * */
            const check = document.getElementsByClassName(`in-${field?.classList[0]}`) as HTMLCollectionOf<HTMLElement>
            /** 드래그 했는 카드를  마우스 포인트가 있는 필드의 중심으로 이동 */
            ChangeLocation(card.current,{x:BX,y:BY})
            const p_name = card.current.querySelector('.current-position')
            if(!p_name) return
            p_name && (p_name.innerHTML = field?.classList[0].toUpperCase())
            const current = startField.current as Field
            const target = field?.classList[0] as Field
            /** 만약 해당 필드에 이미 카드가 있으면 */
            if(check.length > 0 && check[0] !== card.current){
                ExchangeCardPosition({ index,current,target })
                /** 해당 필드의 카드 가져오기 */
                const element = check[0];
                /** 드래그 했던 카드의 시작 위치로 이동 */
                ChangeLocation(element,{x:AX,y:AY})
                const p_name2 = element.querySelector('.current-position')
                p_name2 && (p_name2.innerHTML = get?.classList[0].toUpperCase())
                /** 클래스 초기화 */
                element.className = 'card'
                /** 위치를 바꾸면서 클래스도 그에 맞게 변경(클래스 명을 서로 교환) */
                cl && element.classList.add(`in-${cl}`)
            }
            else{
                ChangeCardPosition({ index,target })
            }
            /** 해당 필드의 클래스명 부여 */
            card.current.classList.add(`in-${field?.classList[0]}`)
            /** 작업을 다 끝낸 후 초기화 시켜주기 */
            underElement.current = null;
        }
    }
    
    return {
        DragStart,
        Dragging,
        DragEnd,
        card,
        elementSize,
        SelectPlayerDelete
    }
}