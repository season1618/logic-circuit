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
        let nodeGridPos = new Array();

        for(let i = 0; i < this.nInput; i++){
            nodeArray.push(['in']);
            nodeArray.push(['not']);
            nodeGridPos.push([0, i]);
            nodeGridPos.push([1, i]);
        }
        for(let i = 0; i < (1 << this.nInput); i++){
            nodeArray.push(['and']);
            nodeGridPos.push([2, i]);
        }
        for(let i = 0; i < this.nOutput; i++){
            nodeArray.push(['or']);
            nodeArray.push(['out']);
            nodeGridPos.push([3, i]);
            nodeGridPos.push([4, i]);
        }

        for(let i = 0; i < this.nInput; i++){
            inputArray[2*i+1].push(2*i);
        }
        for(let i = 0; i < (1 << this.nInput); i++){
            for(let j = 0; j < this.nInput; j++){
                if((i >> this.nInput - 1 - j) & 1) inputArray[2*this.nInput + i].push(2*j);
                else inputArray[2*this.nInput + i].push(2*j+1);
            }
            for(let j = 0; j < this.nOutput; j++){
                if(this.outArray[i][j] == 1) inputArray[2*this.nInput + (1 << this.nInput) + 2*j].push(2*this.nInput + i);
            }
        }
        for(let i = 0; i < this.nOutput; i++){
            inputArray[2*this.nInput + (1 << this.nInput) + 2*i+1].push(2*this.nInput + (1 << this.nInput) + 2*i);
        }
        return [nodeArray, inputArray, nodeGridPos];
    }

    getCNF(){
        let nodeArray = new Array();
        let inputArray = new Array(2*this.nInput + (1 << this.nInput) + 2*this.nOutput).fill().map(() => []);
        let nodeGridPos = new Array();

        for(let i = 0; i < this.nInput; i++){
            nodeArray.push(['in']);
            nodeArray.push(['not']);
            nodeGridPos.push([0, i]);
            nodeGridPos.push([1, i]);
        }
        for(let i = 0; i < (1 << this.nInput); i++){
            nodeArray.push(['or']);
            nodeGridPos.push([2, i]);
        }
        for(let i = 0; i < this.nOutput; i++){
            nodeArray.push(['and']);
            nodeArray.push(['out']);
            nodeGridPos.push([3, i]);
            nodeGridPos.push([4, i]);
        }

        for(let i = 0; i < this.nInput; i++){
            inputArray[2*i+1].push(2*i);
        }
        for(let i = 0; i < (1 << this.nInput); i++){
            for(let j = 0; j < this.nInput; j++){
                if((i >> this.nInput - 1 - j) & 1) inputArray[2*this.nInput + i].push(2*j+1);
                else inputArray[2*this.nInput + i].push(2*j);
            }
            for(let j = 0; j < this.nOutput; j++){
                if(this.outArray[i][j] == 0) inputArray[2*this.nInput + (1 << this.nInput) + 2*j].push(2*this.nInput + i);
            }
        }
        for(let i = 0; i < this.nOutput; i++){
            inputArray[2*this.nInput + (1 << this.nInput) + 2*i+1].push(2*this.nInput + (1 << this.nInput) + 2*i);
        }
        return [nodeArray, inputArray, nodeGridPos];
    }

    getMinimum(){
        // Quine-McCluskey Algorithm

        let nInput = this.nInput;

        let minterms = [];
        let imps = new Array(this.nInput + 1).fill().map(() => []);
        for(let i = 0; i < (1 << this.nInput); i++){
            if(this.outArray[i] == 1){
                minterms.push(i);
                let cnt = 0;
                let arr = [];
                for(let j = 0; j < this.nInput; j++){
                    cnt += (i >> j) & 1;
                    arr.push((i >> this.nInput - 1 - j) & 1);
                }
                arr.isMerged = false;
                imps[cnt].push(arr);
            }
        }

        let primImps = [];
        while(true){
            imps = calc(imps);
            let sum = 0;
            for(let i = 0; i <= this.nInput; i++) sum += imps[i].length;
            if(sum == 0) break;
        }

        let nAndGate = this.nInput + 1; let comb = 0;
        for(let i = 0; i < (1 << primImps.length); i++){
            let st = new Set();
            let cnt = 0;
            for(let j = 0; j < primImps.length; j++){
                if((i >> j) & 1){
                    binaryToDecimal(primImps[j]).forEach((e) => st.add(e));
                    cnt++;
                }
            }
            if(st.size == minterms.length && cnt < nAndGate){
                nAndGate = cnt;
                comb = i;
            }
        }
        primImps = primImps.filter((e, j) => ((comb >> j) & 1));

        let nodeArray = [];
        let inputArray = [];
        let nodeGridPos = [];
        for(let i = 0; i < this.nInput; i++){
            nodeArray.push(['in']);
            nodeGridPos.push([0, i]);
            inputArray.push([]);
        }
        let notGate = new Array(this.nInput).fill(-1);
        let k = this.nInput;
        for(let i = 0; i < primImps.length; i++){
            for(let j = 0; j < this.nInput; j++){
                if(primImps[i][j] == 0 && notGate[j] == -1){
                    notGate[j] = k;
                    nodeArray.push(['not']);
                    nodeGridPos.push([1, k-this.nInput]);
                    inputArray.push([j]);
                    k++;
                }
            }
        }
        for(let i = 0; i < primImps.length; i++){
            nodeArray.push(['and']);
            nodeGridPos.push([2, i]);
            inputArray.push([]);
            for(let j = 0; j < this.nInput; j++){
                if(primImps[i][j] == 0){
                    inputArray[k + i].push(notGate[j]);
                }else if(primImps[i][j] == 1){
                    inputArray[k + i].push(j);
                }
            }
            
        }
        nodeArray.push(['or']);
        nodeGridPos.push([3, 0]);
        inputArray.push([]);
        for(let i = 0; i < primImps.length; i++) inputArray[k + primImps.length].push(k + i);
        nodeArray.push(['out']);
        nodeGridPos.push([4, 0]);
        inputArray.push([k + primImps.length]);

        return [nodeArray, inputArray, nodeGridPos];

        function calc(imps){
            let ret = new Array(nInput + 1).fill().map(() => []);
            for(let i = 0; i < nInput; i++){
                for(let j = 0; j < imps[i].length; j++){
                    for(let k = 0; k < imps[i+1].length; k++){
                        let hamDist = 0;
                        let flag = false;
                        for(let l = 0; l < nInput; l++){
                            if((imps[i][j][l] == -1) ^ (imps[i+1][k][l] == -1)){
                                flag = true;
                                break;
                            }
                            if(imps[i][j][l] >= 0 && imps[i+1][k][l] >= 0){
                                hamDist += imps[i][j][l] ^ imps[i+1][k][l];
                            }
                        }
                        if(flag) continue;
                        if(hamDist == 1){
                            let arr = [];
                            for(let l = 0; l < nInput; l++){
                                if(imps[i][j][l] != imps[i+1][k][l]) arr.push(-1);
                                else arr.push(imps[i][j][l]);
                            }
                            imps[i][j].isMerged = true;
                            imps[i+1][k].isMerged = true;
                            arr.isMerged = false;
                            ret[i].push(arr);
                        }
                    }
                }
            }
            for(let i = 0; i <= nInput; i++){
                for(let j = 0; j < imps[i].length; j++){
                    if(!imps[i][j].isMerged) primImps.push(imps[i][j]);
                }
            }
            return ret;
        }

        function binaryToDecimal(arr){
            let cnt = 0;
            for(let i = 0; i < nInput; i++){
                if(arr[i] == -1) cnt++;
            }
            let ret = [];
            for(let i = 0; i < (1 << cnt); i++){
                let value = 0; let k = 0;
                for(let j = 0; j < nInput; j++){
                    if(arr[j] == -1){
                        value = 2 * value + ((i >> k) & 1);
                        k++;
                    }else{
                        value = 2 * value + arr[j];
                    }
                }
                ret.push(value);
            }
            return ret;
        }
    }
}

const tt = new TruthTable();

export { thead, tbody, tt };