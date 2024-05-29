import {Provider} from "jotai";
import {ChildProps} from "@/Utils/Type";

export default function JotaiProvider({ children }:ChildProps) {
    return <Provider>{children}</Provider>;
}