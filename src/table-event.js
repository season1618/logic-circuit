import { cir } from './circuit.js';
import { thead, tbody, tt } from './truth-table.js';

const DNF = 0;
const CNF = 1;
const MINIMIZE = 2;

let CIRCUIT_FORM = DNF;

function setCircuitForm(x){
    CIRCUIT_FORM = x;
}

function makeCirucit(){
    let nodeArray, inputArray, nodeGridPos;
    switch(CIRCUIT_FORM){
        case DNF:
            [nodeArray, inputArray, nodeGridPos] = tt.getDNF();
            cir.setCircuit(nodeArray, inputArray);
            cir.align(nodeGridPos);
            break;
        case CNF:
            [nodeArray, inputArray, nodeGridPos] = tt.getCNF();
            cir.setCircuit(nodeArray, inputArray);
            cir.align(nodeGridPos);
            break;
        case MINIMIZE:
            if(tt.nOutput == 1){
                [nodeArray, inputArray, nodeGridPos] = tt.getMinimum();
                cir.setCircuit(nodeArray, inputArray, nodeGridPos);
                cir.align(nodeGridPos);
            }
            break;
    }
    cir.render();
}

thead.addEventListener(
    'mouseover',
    function(e){
        let width = e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left;
        let celCount = (e.clientX - e.currentTarget.getBoundingClientRect().left) / width
        let posCel = e.offsetX / width;
        if(celCount < tt.nInput){
            if(0.2 < posCel && posCel < 0.8){
                if(tt.nInput > 1) this.style.cursor = 'zoom-out';
            }else{
                this.style.cursor = 'zoom-in';
            }
        }else{
            if(0.2 < posCel && posCel < 0.8){
                if(tt.nOutput > 1) this.style.cursor = 'zoom-out';
            }else{
                this.style.cursor = 'zoom-in';
            }
        }
    }
);

thead.addEventListener(
    'click',
    function(e){
        let width = e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left;
        let celCount = (e.clientX - e.currentTarget.getBoundingClientRect().left) / width
        let posCel = e.offsetX / width;
        if(celCount < tt.nInput){
            if(0.2 < posCel && posCel < 0.8){
                if(tt.nInput > 1){
                    tt.setTable(tt.nInput - 1, tt.nOutput);
                    makeCirucit();
                }
            }else{
                tt.setTable(tt.nInput + 1, tt.nOutput);
                makeCirucit();
            }
        }else{
            if(0.2 < posCel && posCel < 0.8){
                if(tt.nOutput > 1){
                    tt.setTable(tt.nInput, tt.nOutput - 1);
                    makeCirucit();
                }
            }else{
                tt.setTable(tt.nInput, tt.nOutput + 1);
                makeCirucit();
            }
        }
    }
);

tbody.addEventListener(
    'click',
    function(e){
        let i = e.target.getAttribute('row');
        let j = e.target.getAttribute('column') - tt.nInput;
        
        if(j >= 0){
            tt.outArray[i][j] ^= 1;
            e.target.textContent = tt.outArray[i][j];
            makeCirucit();
        }
    }
);

export { DNF, CNF, MINIMIZE, CIRCUIT_FORM, setCircuitForm };