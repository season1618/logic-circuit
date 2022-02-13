const table = document.getElementById('table');

class TruthTable {
    constructor(){
        this.nInput;
        this.nOutput;
        this.inputNames;
        this.outputNames;
        this.outArray;
    }
    setTable(nInput, nOutput, outArray = new Array(1 << nInput).fill().map(() => new Array(nOutput).fill(0))){
        this.nInput = nInput;
        this.nOutput = nOutput;
        this.inputNames = new Array(this.nInput).fill().map((inputName, index) => 'in' + (index + 1));
        this.outputNames = new Array(this.nOutput).fill().map((outputName, index) => 'out' + (index + 1));
        this.outArray = outArray;

        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        // thead
        thead.appendChild(document.createElement('tr'));
        thead.appendChild(document.createElement('tr'));
        thead.childNodes[0].appendChild(document.createElement('th'));
        thead.childNodes[0].childNodes[0].setAttribute('colspan', nInput + nOutput);
        thead.childNodes[0].childNodes[0].appendChild(document.createTextNode('Truth Table'));
        let t = this;
        thead.childNodes[1].addEventListener(
            'mouseover',
            function(e){
                let width = e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left;
                let celCount = (e.clientX - e.currentTarget.getBoundingClientRect().left) / width
                let posCel = e.offsetX / width;
                if(celCount < nInput){
                    if(0.2 < posCel && posCel < 0.8){
                        if(nInput > 1) this.style.cursor = 'zoom-out';
                    }else{
                        this.style.cursor = 'zoom-in';
                    }
                }else{
                    if(0.2 < posCel && posCel < 0.8){
                        if(nOutput > 1) this.style.cursor = 'zoom-out';
                    }else{
                        this.style.cursor = 'zoom-in';
                    }
                }
            }
        );
        thead.childNodes[1].addEventListener(
            'click',
            function(e){
                let width = e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left;
                let celCount = (e.clientX - e.currentTarget.getBoundingClientRect().left) / width
                let posCel = e.offsetX / width;
                if(celCount < nInput){
                    if(0.2 < posCel && posCel < 0.8){
                        if(nInput > 1) t.setTable(nInput - 1, nOutput);
                    }else{
                        t.setTable(nInput + 1, nOutput);
                    }
                }else{
                    if(0.2 < posCel && posCel < 0.8){
                        if(nOutput > 1) t.setTable(nInput, nOutput - 1);
                    }else{
                        t.setTable(nInput, nOutput + 1);
                    }
                }
            }
        );
        for(let i = 0; i < this.nInput; i++){
            thead.childNodes[1].appendChild(document.createElement('th'));
            thead.childNodes[1].childNodes[i].appendChild(document.createTextNode(this.inputNames[i]));
        }
        for(let i = 0; i < this.nOutput; i++){
            thead.childNodes[1].appendChild(document.createElement('th'));
            thead.childNodes[1].childNodes[i + this.nInput].appendChild(document.createTextNode(this.outputNames[i]));
        }

        // tbody
        for(let i = 0; i < (1 << this.nInput); i++){
            tbody.appendChild(document.createElement('tr'));

            // input
            for(let j = 0; j < this.nInput; j++){
                tbody.childNodes[i].appendChild(document.createElement('td'));
                tbody.childNodes[i].childNodes[j].appendChild(document.createTextNode((i >> nInput - 1 - j) & 1));
            }
            // output
            for(let j = 0; j < this.nOutput; j++){
                tbody.childNodes[i].appendChild(document.createElement('td'));
                tbody.childNodes[i].childNodes[j + this.nInput].appendChild(document.createTextNode(this.outArray[i][j]));
                let t = this;
                tbody.childNodes[i].childNodes[j + this.nInput].addEventListener(
                    'click',
                    function(e){
                        t.outArray[i][j] ^= 1;
                        e.target.textContent = t.outArray[i][j];
                    }
                );
            }
        }

        table.replaceChild(thead, table.children[0]);
        table.replaceChild(tbody, table.children[1]);
    }
}

const truthTable = new TruthTable();

export { truthTable };