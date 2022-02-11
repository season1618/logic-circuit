const table = document.getElementById('table');

class TruthTable {
    constructor(nInput, nOutput){
        this.nInput;
        this.nOutput;
        this.inputNames;
        this.outputNames;
        this.outArray;
        this.setTable(nInput, nOutput);
    }
    setTable(nInput, nOutput){
        this.nInput = nInput;
        this.nOutput = nOutput;
        this.inputNames = new Array(this.nInput).fill().map((inputName, index) => 'in' + (index + 1));
        this.outputNames = new Array(this.nOutput).fill().map((outputName, index) => 'out' + (index + 1));
        this.outArray = new Array((1 << this.nInput)).fill(new Array(this.nOutput).fill(0));

        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        
        thead.appendChild(document.createElement('tr'));
        thead.appendChild(document.createElement('tr'));
        thead.childNodes[0].appendChild(document.createElement('th'));
        thead.childNodes[0].childNodes[0].setAttribute('colspan', nInput + nOutput);
        thead.childNodes[0].childNodes[0].appendChild(document.createTextNode('Truth Table'));
        for(let i = 0; i < this.nInput; i++){
            thead.childNodes[1].appendChild(document.createElement('th'));
            thead.childNodes[1].childNodes[i].appendChild(document.createTextNode(this.inputNames[i]));
        }
        for(let i = 0; i < this.nOutput; i++){
            thead.childNodes[1].appendChild(document.createElement('th'));
            thead.childNodes[1].childNodes[i + this.nInput].appendChild(document.createTextNode(this.outputNames[i]));
        }

        for(let i = 0; i < (1 << this.nInput); i++){
            tbody.appendChild(document.createElement('tr'));
            for(let j = 0; j < this.nInput; j++){
                tbody.childNodes[i].appendChild(document.createElement('td'));
                tbody.childNodes[i].childNodes[j].appendChild(document.createTextNode((i >> nInput - 1 - j) & 1));
            }
            for(let j = 0; j < this.nOutput; j++){
                tbody.childNodes[i].appendChild(document.createElement('td'));
                tbody.childNodes[i].childNodes[j + this.nInput].appendChild(document.createTextNode(0));
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

const truthTable = new TruthTable(2, 2);