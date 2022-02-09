import { Node, canvas, cir, scale, ctx } from './circuit.js';

let DEFAULT = 0;
let LOGIC_GATE_MOVE = 1;
let LOGIC_GATE_ADD = 2;
let WIRING = 3;
let WIRING_FIRST = 4;
let WIRING_SECOND = 5;
let WIRING_THIRD = 6;

let ACTIVE_GATE = -1;

let state = DEFAULT;
let refPos = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

canvas.addEventListener(
    'mousedown',
    function(e){
        switch(state){
            case DEFAULT:
                let x = e.clientX;
                let y = e.clientY;
                for(let i = 0; i < cir.length; i++){
                    if(Math.sqrt((x - cir[i].x)**2 + (y - cir[i].y)**2) < 0.2*scale){
                        refPos[0].x = cir[i].x;
                        refPos[0].y = cir[i].y;
                        ACTIVE_GATE = i;
                        state = WIRING_FIRST;
                        break;
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
                if(Math.abs(e.clientY - refPos[0].y) < 0.4 * scale){
                    cir.render();
                    ctx.beginPath();
                    ctx.moveTo(refPos[0].x, refPos[0].y);
                    ctx.lineTo(e.clientX, refPos[0].y);
                    ctx.stroke();
                }else{
                    refPos[1].x = e.clientX;
                    refPos[1].y = refPos[0].y;
                    state = WIRING_SECOND;
                }
                break;
            case WIRING_SECOND:
                if(Math.abs(e.clientX - refPos[1].x) < 0.4 * scale){
                    cir.render();
                    ctx.beginPath();
                    ctx.moveTo(refPos[0].x, refPos[0].y);
                    ctx.lineTo(refPos[1].x, refPos[1].y);
                    ctx.lineTo(refPos[1].x, e.clientY);
                    ctx.stroke();
                }else{
                    refPos[2].x = refPos[1].x;
                    refPos[2].y = e.clientY;
                    state = WIRING_THIRD;
                }
                break;
            case WIRING_THIRD:
                for(let i = 0; i < cir.length; i++){
                    if(cir[i].x - scale < e.clientX && e.clientX < cir[i].x && Math.abs(refPos[2].y - cir[i].y) < 0.4*scale){
                        cir.input[i].push(ACTIVE_GATE);
                        state = DEFAULT;
                        return;
                    }
                }
                cir.render();
                ctx.beginPath();
                ctx.moveTo(refPos[0].x, refPos[0].y);
                ctx.lineTo(refPos[1].x, refPos[1].y);
                ctx.lineTo(refPos[2].x, refPos[2].y);
                ctx.lineTo(e.clientX, refPos[2].y);
                ctx.stroke();
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
            case WIRING_FIRST:
            case WIRING_SECOND:
            case WIRING_THIRD:
                cir.render();
                state = DEFAULT;
                break;
        }
    }
);

let newLogicGate;
let num;
canvas.addEventListener(
    'dblclick',
    function(e){
        if(state == DEFAULT){
            state = LOGIC_GATE_ADD;
            num = 0;
            newLogicGate = new Node('and', 0, e.clientX, e.clientY);
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