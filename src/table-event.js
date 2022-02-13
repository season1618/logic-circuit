import { thead, tt } from './truth-table.js';

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
                if(tt.nInput > 1) tt.setTable(tt.nInput - 1, tt.nOutput);
            }else{
                tt.setTable(tt.nInput + 1, tt.nOutput);
            }
        }else{
            if(0.2 < posCel && posCel < 0.8){
                if(tt.nOutput > 1) tt.setTable(tt.nInput, tt.nOutput - 1);
            }else{
                tt.setTable(tt.nInput, tt.nOutput + 1);
            }
        }
    }
);