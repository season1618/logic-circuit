import { cir } from './circuit.js';
import { thead, tbody, tt } from './truth-table.js';

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
                    cir.setCircuit(...tt.getDNF());
                    cir.align();
                    cir.render();
                }
            }else{
                tt.setTable(tt.nInput + 1, tt.nOutput);
                cir.setCircuit(...tt.getDNF());
                cir.align();
                cir.render();
            }
        }else{
            if(0.2 < posCel && posCel < 0.8){
                if(tt.nOutput > 1){
                    tt.setTable(tt.nInput, tt.nOutput - 1);
                    cir.setCircuit(...tt.getDNF());
                    cir.align();
                    cir.render();
                }
            }else{
                tt.setTable(tt.nInput, tt.nOutput + 1);
                cir.setCircuit(...tt.getDNF());
                cir.align();
                cir.render();
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
            cir.setCircuit(...tt.getDNF());
            cir.align();
            cir.render();
        }
    }
);