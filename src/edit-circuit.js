import { Node, canvas, cir, scale } from './circuit.js';

let DEFAULT = 0;
let LOGIC_GATE_MOVE = 1;
let LOGIC_GATE_ADD = 2;
let WIRING = 3;
let WIRING_FIRST = 4;
let WIRING_SECOND = 5;
let WIRING_THIRD = 6;

let ACTIVE_GATE = -1;

let state = DEFAULT;

canvas.addEventListener(
    'mousedown',
    function(e){
        switch(state){
            case DEFAULT:
                let x = e.clientX;
                let y = e.clientY;
                for(let i = 0; i < cir.length; i++){
                    if(Math.sqrt((x - cir[i].x)**2 + (y - cir[i].y)**2) < 0.2*scale){
                        state = WIRING_FIRST;
                    }
                    if(cir[i].x - scale < x && x < cir[i].x && Math.abs(y - cir[i].y) < 0.4*scale){
                        ACTIVE_GATE = i;
                        state = LOGIC_GATE_MOVE;
                        break;
                    }
                }
                break;
        }
    }
);
canvas.addEventListener(
    'mousemove',
    function(e){
        switch(state){
            case LOGIC_GATE_MOVE:
                cir[ACTIVE_GATE].x = e.clientX;
                cir[ACTIVE_GATE].y = e.clientY;
                cir.render();
                break;
            case WIRING_FIRST:
                break;
        }
    }
);
canvas.addEventListener(
    'mouseup',
    function(){
        switch(state){
            case LOGIC_GATE_MOVE:
                state = DEFAULT;
                break;
        }
    }
);

let posX, posY;
let newLogicGate;
let num;
canvas.addEventListener(
    'dblclick',
    function(e){
        if(state == DEFAULT){
            state = LOGIC_GATE_ADD;
            posX = e.clientX;
            posY = e.clientY;
            num = 0;
            newLogicGate = new Node('and', 0, posX, posY);
            newLogicGate.render();
        }
    }
);
canvas.addEventListener(
    'wheel',
    function(e){
        if(state == LOGIC_GATE_ADD){
            if(e.deltaY > 0){
                num += 1
                num %= 3;
            }else{
                num += 2;
                num %= 3;
            }
            switch(num){
                case 0:
                    newLogicGate.kind = 'and';
                    break;
                case 1:
                    newLogicGate.kind = 'or';
                    break;
                case 2:
                    newLogicGate.kind = 'not';
                    break;
            }
            cir.render();
            newLogicGate.render();
        }
    }
);
canvas.addEventListener(
    'click',
    function(e){
        if(state == LOGIC_GATE_ADD){
            if(newLogicGate.x - scale < e.clientX && e.clientX < newLogicGate.x && Math.abs(e.clientY - newLogicGate.y) < 0.4*scale){
                cir.push(newLogicGate);
                cir.input.push([]);
                state = DEFAULT;
            }else{
                cir.render();
                state = DEFAULT;
            }
        }
    }
);