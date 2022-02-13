const table = document.getElementById('table');
const thead = table.children[0];
const tbody = table.children[1];

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

        while(thead.firstChild) thead.removeChild(thead.firstChild);
        while(tbody.firstChild) tbody.removeChild(tbody.firstChild);

        // thead
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

        // tbody
        for(let i = 0; i < (1 << this.nInput); i++){
            tbody.appendChild(document.createElement('tr'));

            // input
            for(let j = 0; j < this.nInput; j++){
                tbody.childNodes[i].appendChild(document.createElement('td'));
                tbody.childNodes[i].childNodes[j].setAttribute('row', i);
                tbody.childNodes[i].childNodes[j].setAttribute('column', j);
                tbody.childNodes[i].childNodes[j].appendChild(document.createTextNode((i >> nInput - 1 - j) & 1));
            }
            // output
            for(let j = 0; j < this.nOutput; j++){
                tbody.childNodes[i].appendChild(document.createElement('td'));
                tbody.childNodes[i].childNodes[j + this.nInput].setAttribute('row', i);
                tbody.childNodes[i].childNodes[j + this.nInput].setAttribute('column', j + this.nInput);
                tbody.childNodes[i].childNodes[j + this.nInput].appendChild(document.createTextNode(this.outArray[i][j]));
            }
        }
    }

    getDNF(){
        let nodeArray = new Array();
        let inputArray = new Array(2*this.nInput + (1 << this.nInput) + 2*this.nOutput).fill().map(() => []);

        for(let i = 0; i < this.nInput; i++){
            nodeArray.push(['in']);
            nodeArray.push(['not']);
        }
        for(let i = 0; i < (1 << this.nInput); i++){
            nodeArray.push(['and']);
        }
        for(let i = 0; i < this.nOutput; i++){
            nodeArray.push(['or']);
            nodeArray.push(['out']);
        }

        for(let i = 0; i < this.nInput; i++){
            inputArray[2*i+1].push(2*i);
        }
        for(let i = 0; i < (1 << this.nInput); i++){
            for(let j = 0; j < this.nInput; j++){
                if((i >> j) & 1) inputArray[2*this.nInput + i].push(2*j);
                else inputArray[2*this.nInput + i].push(2*j+1);
            }
            for(let j = 0; j < this.nOutput; j++){
                if(this.outArray[i][j] == 1) inputArray[2*this.nInput + (1 << this.nInput) + 2*j].push(2*this.nInput + i);
            }
        }
        for(let i = 0; i < this.nOutput; i++){
            inputArray[2*this.nInput + (1 << this.nInput) + 2*i+1].push(2*this.nInput + (1 << this.nInput) + 2*i);
        }
        return [nodeArray, inputArray];
    }
}

const tt = new TruthTable();

export { thead, tbody, tt };