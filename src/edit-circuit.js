import { canvas, ctx } from './canvas.js';
import { canvasScale, Node, cir } from './circuit.js';
import { tt } from './truth-table.js';

let DEFAULT = 0;
let LOGIC_GATE_MOVE = 1;
let LOGIC_GATE_ADD = 2;
let WIRING_FIRST = 3;
let WIRING_SECOND = 4;
let WIRING_THIRD = 5;
let SCREEN_MOVE = 6;

let ACTIVE_GATE = -1;

let state = DEFAULT;
let refPos = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
let mousePrevX, mousePrevY;

canvas.addEventListener(
    'mousedown',
    function(e){
        switch(state){
            case DEFAULT:
                let x = e.clientX;
                let y = e.clientY;
                for(let i = 0; i < cir.length; i++){
                    if(Math.sqrt((x - cir[i].x)**2 + (y - cir[i].y)**2) < 0.2*canvasScale){
                        refPos[0].x = cir[i].x;
                        refPos[0].y = cir[i].y;
                        ACTIVE_GATE = i;
                        state = WIRING_FIRST;
                        return;
                    }
                    if(cir[i].include(e.clientX, e.clientY)){
                        ACTIVE_GATE = i;
                        state = LOGIC_GATE_MOVE;
                        return;
                    }
                }
                state = SCREEN_MOVE;
                mousePrevX = e.clientX;
                mousePrevY = e.clientY;
                break;
        }
    }
);

canvas.addEventListener(
    'mousemove',
    function(e){
        switch(state){
            case SCREEN_MOVE:
                cir.translate(e.clientX - mousePrevX, e.clientY - mousePrevY);
                cir.render();
                mousePrevX = e.clientX;
                mousePrevY = e.clientY;
                break;
            case LOGIC_GATE_MOVE:
                cir[ACTIVE_GATE].x = e.clientX;
                cir[ACTIVE_GATE].y = e.clientY;
                cir.render();
                break;
            case WIRING_FIRST:
                for(let i = 0; i < cir.length; i++){
                    if(i == ACTIVE_GATE) continue;
                    if((cir[i].kind == 'out' || cir[i].kind == 'not') && cir[i].input.length >= 1) continue;
                    if(cir[i].include(e.clientX, refPos[0].y)){
                        if(!cir.isConnected(ACTIVE_GATE, i)) cir[i].input.push(cir[ACTIVE_GATE]);
                        tt.setTable(...cir.getTruthTable());
                        state = DEFAULT;
                        return;
                    }
                }
                if(Math.abs(e.clientY - refPos[0].y) < 0.4 * canvasScale){
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
                for(let i = 0; i < cir.length; i++){
                    if(i == ACTIVE_GATE) continue;
                    if((cir[i].kind == 'out' || cir[i].kind == 'not') && cir[i].input.length >= 1) continue;
                    if(cir[i].include(refPos[1].x, e.clientY)){
                        if(!cir.isConnected(ACTIVE_GATE, i)) cir[i].input.push(cir[ACTIVE_GATE]);
                        tt.setTable(...cir.getTruthTable());
                        state = DEFAULT;
                        return;
                    }
                }
                if(Math.abs(e.clientX - refPos[1].x) < 0.4 * canvasScale){
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
                    if(i == ACTIVE_GATE) continue;
                    if((cir[i].kind == 'out' || cir[i].kind == 'not') && cir[i].input.length >= 1) continue;
                    if(cir[i].include(e.clientX, refPos[2].y)){
                        if(!cir.isConnected(ACTIVE_GATE, i)) cir[i].input.push(cir[ACTIVE_GATE]);
                        tt.setTable(...cir.getTruthTable());
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
            case SCREEN_MOVE:
                state = DEFAULT;
                break;
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
            num = 2;
            newLogicGate = new Node('not', e.clientX, e.clientY);
            newLogicGate.render();
        }
    }
);

canvas.addEventListener(
    'wheel',
    function(e){
        switch(state){
            case DEFAULT:
                if(canvasScale < 1 && e.deltaY > 0) return;
                if(10000 < canvasScale && e.deltaY < 0) return;
                if(e.deltaY < 0) cir.scale(e.clientX, e.clientY, 1.2);
                else cir.scale(e.clientX, e.clientY, 1/1.2);
                cir.render();
                //canvasScale -= e.deltaY / 20;
                break;
            case LOGIC_GATE_ADD:
                if(e.deltaY > 0){
                    num += 1
                    num %= 5;
                }else{
                    num += 4;
                    num %= 5;
                }
                switch(num){
                    case 0:
                        newLogicGate.kind = 'in';
                        break;
                    case 1:
                        newLogicGate.kind = 'out';
                        break;
                    case 2:
                        newLogicGate.kind = 'not';
                        break;
                    case 3:
                        newLogicGate.kind = 'and';
                        break;
                    case 4:
                        newLogicGate.kind = 'or';
                        break;
                }
                cir.render();
                newLogicGate.render();
                break;
        }
    }
);

canvas.addEventListener(
    'click',
    function(e){
        if(state == LOGIC_GATE_ADD){
            if(newLogicGate.include(e.clientX, e.clientY)){
                cir.add(newLogicGate);
                state = DEFAULT;
            }else{
                cir.render();
                state = DEFAULT;
            }
        }
    }
);