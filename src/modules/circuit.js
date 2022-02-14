import { canvas, ctx } from './canvas.js';

let canvasScale = 100;

class Node {
    constructor(kind, x = 0, y = 0){
        // in, out, not, and, or
        this.kind = kind;
        // position of right side
        this.x = x;
        this.y = y;
        this.input = [];

        this.gridX = 0;
        this.gridY = -1;
        this.value = 0;
        this.isVisited = false;
    }

    left(){
        switch(this.kind){
            case 'in':
                return this.x - 0.5 * canvasScale;
            case 'out':
                return this.x;
            case 'not':
                return this.x - (0.7*1.73/2 + 0.16) * canvasScale;
            case 'and':
            case 'or':
                return this.x - canvasScale;
        }
    }
    right(){
        if(this.kind == 'out') return this.x + 0.5 * canvasScale;
        else return this.x;
    }
    height(){
        switch(this.kind){
            case 'in':
            case 'out':
                return 0.6 * canvasScale;
            case 'not':
                return 0.7 * canvasScale;
            case 'and':
            case 'or':
                return 0.8 * canvasScale;
        }
    }

    translate(mouseMoveX, mouseMoveY){
        this.x += mouseMoveX;
        this.y += mouseMoveY;
    }
    scale(mouseX, mouseY, scaleRate){
        this.x = mouseX + (this.x - mouseX) * scaleRate;
        this.y = mouseY + (this.y - mouseY) * scaleRate;
    }

    include(x, y){
        if(this.left() < x && x < this.right() && Math.abs(y - this.y) < this.height() / 2) return true;
        else return false;
    }

    calcValue(){
        switch(this.kind){
            case 'in':
                break;
            case 'out':
                if(this.input.length > 0) this.value = this.input[0].value;
                break;
            case 'not':
                if(this.input.length > 0) this.value = this.input[0].value ^ 1;
                break;
            case 'and':
                this.value = 1;
                for(let g of this.input) this.value &= g.value;
                break;
            case 'or':
                this.value = 0;
                for(let g of this.input) this.value |= g.value;
                break;
        }
    }

    sort(l = 0, r = this.input.length){
        if(l + 1 >= r) return;
        let m = Math.floor((l + r) / 2);
        this.sort(l, m);
        this.sort(m, r);
        let tempArray = new Array(r - l);
        let i = l, j = m;
        for(let k = 0; k < r - l; k++){
            if(i == m){
                tempArray[k] = this.input[j];
                j++;
            }else if(j == r){
                tempArray[k] = this.input[i];
                i++;
            }else if(this.input[i].y <= this.input[j].y){
                tempArray[k] = this.input[i];
                i++;
            }else{
                tempArray[k] = this.input[j];
                j++;
            }
        }
        for(let k = 0; k < r - l; k++){
            this.input[l + k] = tempArray[k];
        }
    }

    render(){
        switch(this.kind){
            case 'in':
                ctx.font = '15px sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText('in' + (this.gridY + 1) + ' ', this.x , this.y);
                break;
            case 'out':
                ctx.font = '15px sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(' out' + (this.gridY + 1), this.x, this.y);
                break;
            case 'not':
                ctx.beginPath();
                ctx.arc(this.x - 0.08*canvasScale, this.y, 0.08*canvasScale, 0, 2*Math.PI);
                ctx.moveTo(this.x - 0.16*canvasScale, this.y);
                ctx.lineTo(this.x - 0.16*canvasScale - 0.7*Math.sqrt(3)/2*canvasScale, this.y + 0.7/2*canvasScale);
                ctx.lineTo(this.x - 0.16*canvasScale - 0.7*Math.sqrt(3)/2*canvasScale, this.y - 0.7/2*canvasScale);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'and':
                ctx.beginPath();
                ctx.arc(this.x - 0.4*canvasScale, this.y, 0.4*canvasScale, -Math.PI/2, Math.PI/2);
                ctx.moveTo(this.x - 0.4*canvasScale, this.y + 0.4*canvasScale);
                ctx.lineTo(this.x - canvasScale, this.y + 0.4*canvasScale);
                ctx.lineTo(this.x - canvasScale, this.y - 0.4*canvasScale);
                ctx.lineTo(this.x - 0.4*canvasScale, this.y - 0.4*canvasScale);
                ctx.stroke();
                break;
            case 'or':
                ctx.beginPath();
                ctx.arc(this.x - 0.7*canvasScale, this.y - 0.4*canvasScale, 0.8*canvasScale, Math.PI/6, Math.PI/2);
                ctx.lineTo(this.x - 1.1*canvasScale, this.y + 0.4*canvasScale);
                ctx.arc(this.x - 1.8*canvasScale, this.y, 0.8*canvasScale, Math.PI/6, -Math.PI/6, true);
                ctx.lineTo(this.x - 0.7*canvasScale, this.y - 0.4*canvasScale);
                ctx.arc(this.x - 0.7*canvasScale, this.y + 0.4*canvasScale, 0.8*canvasScale, -Math.PI/2, -Math.PI/6);
                ctx.stroke();
                break;
        }
    }
}

class Circuit extends Array {
    constructor(){
        super();
        this.nInput = 0;
        this.nOutput = 0;
        this.nColumn = 0;
    }

    setCircuit(nodeArray, inputArray){
        this.splice(0);
        this.nInput = 0;
        this.nOutput = 0;
        for(let i = 0; i < nodeArray.length; i++){
            this.push(new Node(...nodeArray[i]));
            if(this[i].kind == 'in') this.nInput++;
            else if(this[i].kind == 'out') this.nOutput++;
        }
        this.nColumn = 0;
        for(let i = 0; i < inputArray.length; i++){
            for(let j = 0; j < inputArray[i].length; j++){
                this[i].input.push(this[inputArray[i][j]]);
            }
        }
    }

    translate(mouseMoveX, mouseMoveY){
        for(let i = 0; i < this.length; i++) this[i].translate(mouseMoveX, mouseMoveY);
    }
    scale(mouseX, mouseY, scaleRate){
        canvasScale *= scaleRate;
        for(let i = 0; i < this.length; i++) this[i].scale(mouseX, mouseY, scaleRate);
    }

    add(node){
        cir.push(node);
        if(node.kind == 'in') this.nInput++;
        else if(node.kind == 'out') this.nOutput++;
    }

    isConnected(i, j){
        // in: j -> out: i
        for(let i = 0; i < this.length; i++) this[i].isVisited = false;
        dfs(this[i]);
        if(this[j].isVisited) return true;
        else false;

        function dfs(v){
            v.isVisited = true;
            for(let u of v.input){
                if(!u.isVisited) dfs(u);
            }
        }
    }

    calcGridX(){
        for(let i = 0; i < this.length; i++){
            this[i].isVisited = false;
            this[i].gridX = 0;
        }
        this.nColumn = 0;
        for(let i = 0; i < this.length; i++){
            if(!this[i].isVisited){
                dfs(this[i]);
                this.nColumn = Math.max(this.nColumn, this[i].gridX + 1);
            }
        }
        for(let i = 0; i < this.length; i++){
            if(this[i].kind == 'out') this[i].gridX = this.nColumn - 1;
        }

        function dfs(v){
            if(v.isVisited) return;
            v.isVisited = true;
            if(v.kind == 'in'){
                v.gridX = 0;
                return;
            }
            for(let u of v.input){
                dfs(u)
                v.gridX = Math.max(v.gridX, u.gridX);
            }
            v.gridX++;
        }
    }
    calcGridY(){
        let s = 0, t = 0;
        for(let i = 0; i < this.length; i++){
            if(s < this[i].gridX){
                s++;
                t = 0;
            }
            this[i].gridY = t;
            t++;
        }
    }
    sort(l = 0, r = this.length){
        if(l + 1 >= r) return;
        let m = Math.floor((l + r) / 2);
        this.sort(l, m);
        this.sort(m, r);
        let tempArray = new Array(r - l);
        let i = l, j = m;
        for(let k = 0; k < r - l; k++){
            if(i == m){
                tempArray[k] = this[j];
                j++;
            }else if(j == r){
                tempArray[k] = this[i];
                i++;
            }else if(this[i].gridX < this[j].gridX || this[i].gridX == this[j].gridX && this[i].y <= this[j].y){
                tempArray[k] = this[i];
                i++;
            }else{
                tempArray[k] = this[j];
                j++;
            }
        }
        for(let k = 0; k < r - l; k++){
            this[l + k] = tempArray[k];
        }
    }
    align(nodeGridPos = null){
        if(nodeGridPos == null){
            for(let i = 0; i < this.length; i++) this[i].sort();
            this.calcGridX();
            this.sort();
            this.calcGridY();
        }else{
            this.nColumn = 0;
            for(let i = 0; i < this.length; i++){
                this[i].gridX = nodeGridPos[i][0];
                this[i].gridY = nodeGridPos[i][1];
                this.nColumn = Math.max(this.nColumn, this[i].gridX + 1);
            }
        }

        let nRow = new Array(this.nColumn).fill(0);
        for(let i = 0; i < this.length; i++){
            nRow[this[i].gridX]++;
        }

        let H = 2*canvasScale, W = 2*canvasScale;
        for(let i = 0; i < this.length; i++){
            switch(this[i].kind){
                case 'in':
                case 'out':
                    this[i].x = this[i].gridX * W - (this.nColumn - 1)/2 * W + canvas.width / 2;
                    break;
                case 'not':
                    this[i].x = this[i].gridX * W + 0.7*Math.sqrt(3)/3 * canvasScale - (this.nColumn - 1)/2 * W + canvas.width / 2;
                    break;
                case 'and':
                case 'or':
                    this[i].x = this[i].gridX * W + 0.5 * canvasScale - (this.nColumn - 1)/2 * W + canvas.width / 2;
                    break;
            }
            if(this[i].kind == 'not' && this[i].input.length > 0) this[i].y = this[i].input[0].y + H / 2;
            else this[i].y = this[i].gridY * H - (nRow[this[i].gridX] - 1)/2 * H + canvas.height / 2;
        }
    }
    
    render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let isUsed = new Array(Math.floor(canvas.width / (canvasScale/10))).fill(false);
        for(let i = 0; i < this.length; i++){
            this[i].render();
            let n = this[i].input.length;
            let k = 0;
            for(let g of this[i].input){
                let wireTurnY = Math.floor((this[i].left() - 0.2*canvasScale) / (canvasScale/10));
                for(; wireTurnY >= 0; wireTurnY--){
                    if(!isUsed[wireTurnY]){
                        isUsed[wireTurnY] = true;
                        break;
                    }
                }
                wireTurnY *= canvasScale / 10;
                k++;
                ctx.beginPath();
                ctx.moveTo(g.x, g.y);
                ctx.lineTo(wireTurnY, g.y);
                ctx.lineTo(wireTurnY, this[i].y - this[i].height()/2 + k/(n+1)*this[i].height());
                ctx.lineTo(this[i].left(), this[i].y - this[i].height()/2 + k/(n+1)*this[i].height());
                ctx.stroke();
            }
        }
    }
    play(){}

    getTruthTable(){
        this.calcGridX();
        this.sort();
        let outArray = new Array(1 << this.nInput);
        for(let i = 0; i < (1 << this.nInput); i++){
            outArray[i] = new Array();
            for(let j = 0; j < this.nInput; j++){
                this[j].value = (i >> j) & 1;
            }
            for(let j = this.nInput; j < this.length; j++){
                this[j].calcValue();
                if(this[j].kind == 'out') outArray[i].push(this[j].value);
            }
        }
        return [this.nInput, this.nOutput, outArray];
    }
}

const cir = new Circuit();

export { canvasScale, Node, cir };