import {ChildProps} from "@/Utils/Type";
import AlertModal from "@/Container/Modal/Alert";


export default function Main({ children }:ChildProps){
    
    
    
    return (
        <main>
            {children}
            <AlertModal/>
        </main>
    )
}