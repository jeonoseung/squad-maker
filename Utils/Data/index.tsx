import {Field} from "@/Utils/Type";

export const ListLength = 10
export interface Formation {
    name:string
    position:Field[]
}
export const FormationList:Formation[] = [
    { name:"3-4-3",position:["st","lf","rf","lm","lcm","rcm","rm","cb","lcb","rcb"] },
    { name:"3-2-3-2",position:["st","cf","lm","rm","cm","ldm","rdm","cb","lcb","rcb"] },
    { name:"3-4-3(2)",position:["st","lw","rw","lm","lcm","rcm","rm","cb","lcb","rcb"] },
    { name:"3-2-2-1-2",position:["ls","rs","cam","lm","rm","ldm","rdm","cb","lcb","rcb"] },
    { name:"3-4-1-2",position:["ls","rs","cam","lm","rm","lcm","rcm","cb","lcb","rcb"] },
    { name:"3-1-2-1-3",position:["st","lw","rw","cam","lm","rm","cdm","cb","lcb","rcb"] },
    { name:"3-1-4-2",position:["ls","rs","lm","rm","lcm","rcm","cdm","cb","lcb","rcb"] },
    { name:"4-5-1",position:["st","lm","lcm","cm","rcm","rm","lb","lcm","rcm","rb"] },
    { name:"4-3-3",position:["lw","st","rw","lcm","cm","rcm","lb","lcb","rcb","rb"] },
    { name:"4-4-2",position:["st","cf","lm","lcm","rcm","rm","lb","lcb","rcb","rb"] },
    { name:"4-3-3(2)",position:["st","lf","rf","lcm","cm","rcm","lb","lcb","rcb","rb"] },
    { name:"4-4-2(2)",position:["ls","rs","lm","lcm","rcm","rm","lb","lcb","rcb","rb"] },
    { name:"4-3-2-1",position:["st","lam","ram","cm","lm","rm","lb","lcb","rcb","rb"] },
    { name:"4-4-1-1",position:["st","cam","lm","lcm","rcm","rm","lb","lcb","rcb","rb"] },
    { name:"4-3-1-2",position:["ls","rs","cam","lcm","cm","rcm","lb","lcb","rcb","rb"] },
    { name:"4-2-4",position:["ls","rs","lw","rw","lcm","rcm","lb","lcb","rcb","rb"] },
    { name:"4-1-4-1",position:["st","lm","lcm","rcm","rm","cdm","lb","lcb","rcb","rb"] },
    { name:"4-2-3-1",position:["st","lam","cam","ram","ldm","rdm","lb","lcb","rcb","rb"] },
    { name:"4-1-3-2",position:["ls","rs","lm","cm","rm","cdm","lb","lcb","rcb","rb"] },
    { name:"4-2-2-2",position:["ls","rs","lm","rm","ldm","rdm","lb","lcb","rcb","rb"] },
    { name:"4-1-2-3",position:["lw","st","rw","lcm","rcm","cdm","lb","lcb","rcb","rb"] },
    { name:"4-2-2-2(2)",position:["ls","rs","lam","ram","ldm","rdm","lb","lcb","rcb","rb"] },
    { name:"4-1-2-3(2)",position:["lw","rw","cf","lcm","rcm","cdm","lb","lcb","rcb","rb"] },
    { name:"4-2-2-1-1",position:["st","cam","lm","rm","ldm","rdm","lb","lcb","rcb","rb"] },
    { name:"4-1-2-1-2",position:["ls","rs","cam","lm","rm","cdm","lb","lcb","rcb","rb"] },
    { name:"4-2-1-3",position:["st","lw","rw","cam","lcm","rcm","lb","lcb","rcb","rb"] },
    { name:"4-1-2-1-2(2)",position:["ls","rs","cam","lcm","rcm","cdm","lb","lcb","rcb","rb"] },
    { name:"4-2-1-3(2)",position:["st","lw","rw","cm","ldm","rdm","lb","lcb","rcb","rb"] },
    { name:"5-4-1",position:["st","lm","rb","lcm","rcm","lwb","rwb","lcb","rcm","cb"] },
    { name:"5-3-2",position:["ls","rs","lcm","rcm","cm","lwb","rwb","lcb","rcm","cb"] },
    { name:"5-2-3",position:["st","lw","rw","lcm","rcm","lwb","rwb","lcb","rcm","cb"] },
    { name:"5-2-1-2",position:["ls","rs","cam","lcm","rcm","lwb","rwb","lcb","rcm","cb"] },
    { name:"5-1-2-1-1",position:["st","cam","lm","rm","cdm","lwb","rwb","lcb","rcm","cb"] },
]

export const MaxPay = 255

export const LevelArray = [
    1,2,3,4,5,6,7,8,9,10
]
export const FieldList = [
    "gk",
    "sw",
    "rwb",
    "rb",
    "rcb",
    "cb",
    "lcb",
    "lb",
    "lwb",
    "rdm",
    "cdm",
    "ldm",
    "rm",
    "rcm",
    "cm",
    "lcm",
    "lm",
    "ram",
    "cam",
    "lam",
    "rf",
    "cf",
    "lf",
    "rw",
    "rs",
    "st",
    "ls",
    "lw"
]