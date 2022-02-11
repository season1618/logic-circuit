import { ctx, scale } from './canvas.js';

class Node {
    constructor(kind, x = 0, y = 0){
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.input = [];

        this.value = 0;
        this.depth = 0;
        this.isVisited = false;
    }
    include(x, y){
        switch(this.kind){
            case 'in':
            case 'out':
                if(Math.sqrt((x - this.x)**2 + (y - this.y)**2) < 0.4*scale) return true;
                else return false;
            case 'and':
            case 'or':
                if(this.x - scale < x && x < this.x && Math.abs(y - this.y) < 0.4*scale) return true;
                else return false;
            case 'not':
                if(this.x - (0.7*1.73/2 + 0.16) * scale < x && x < this.x && Math.abs(y - this.y) < 0.35*scale) return true;
                else return false;
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
            }else if(this.input[i].y < this.input[j].y){
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
    calcValue(){
    }
    render(){
        switch(this.kind){
            case 'not':
                ctx.beginPath();
                ctx.arc(this.x - 0.08*scale, this.y, 0.08*scale, 0, 2*Math.PI);
                ctx.moveTo(this.x - 0.16*scale, this.y);
                ctx.lineTo(this.x - 0.16*scale - 0.7*Math.sqrt(3)/2*scale, this.y + 0.7/2*scale);
                ctx.lineTo(this.x - 0.16*scale - 0.7*Math.sqrt(3)/2*scale, this.y - 0.7/2*scale);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'and':
                ctx.beginPath();
                ctx.arc(this.x - 0.4*scale, this.y, 0.4*scale, -Math.PI/2, Math.PI/2);
                ctx.moveTo(this.x - 0.4*scale, this.y + 0.4*scale);
                ctx.lineTo(this.x - scale, this.y + 0.4*scale);
                ctx.lineTo(this.x - scale, this.y - 0.4*scale);
                ctx.lineTo(this.x - 0.4*scale, this.y - 0.4*scale);
                ctx.stroke();
                break;
            case 'or':
                ctx.beginPath();
                ctx.arc(this.x - 0.7*scale, this.y - 0.4*scale, 0.8*scale, Math.PI/6, Math.PI/2);
                ctx.lineTo(this.x - 1.1*scale, this.y + 0.4*scale);
                ctx.arc(this.x - 1.8*scale, this.y, 0.8*scale, Math.PI/6, -Math.PI/6, true);
                ctx.lineTo(this.x - 0.7*scale, this.y - 0.4*scale);
                ctx.arc(this.x - 0.7*scale, this.y + 0.4*scale, 0.8*scale, -Math.PI/2, -Math.PI/6);
                ctx.stroke();
                break;
        }
    }
}

class Circuit extends Array {
    constructor(nodeArray, inputArray){
        super(...nodeArray);
        for(let i = 0; i < inputArray.length; i++){
            for(let j = 0; j < inputArray[i].length; j++){
                this[i].input.push(this[inputArray[i][j]]);
            }
        }
        this.align();
    }
    calcDepth(){
        function dfs(v){
            if(v.isVisited) return;
            v.isVisited = true;
            if(v.kind == 'in'){
                v.depth = 0;
                return;
            }
            for(let u of v.input){
                dfs(u)
                v.depth = Math.max(v.depth, u.depth);
            }
            v.depth++;
        }
        for(let i = 0; i < this.length; i++){
            this[i].isVisited = false;
            this[i].depth = 0;
        }
        for(let i = 0; i < this.length; i++){
            if(!this[i].isVisited){
                dfs(this[i]);
            }
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
            }else if(this[i].depth < this[j].depth || this[i].depth == this[j].depth && this[i].y < this[j].y){
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
    align(){
        for(let i = 0; i < this.length; i++) this[i].sort();
        this.calcDepth();
        this.sort();
        let numDepth = new Array(100).fill(0);
        let maxDepth = 0;
        for(let i = 0; i < this.length; i++){
            numDepth[this[i].depth]++;
            maxDepth = Math.max(maxDepth, numDepth[this[i].depth]);
        }
        let H = 2*scale, W = 2*scale;
        let k = 0;
        for(let i = 0; i < this.length; i++){
            let n = numDepth[this[i].depth];
            this[i].x = (this[i].depth + 1) * W;
            this[i].y = (k + 1) * H - (n+1)/2*H + (maxDepth+1)/2*H;
            k++;
            if(k == n) k = 0;
        }
        this.render();
    }
    render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < this.length; i++){
            this[i].render();
            let n = this[i].input.length;
            let k = 0;
            for(let g of this[i].input){
                let r = Math.random();
                k++;
                ctx.beginPath();
                ctx.moveTo(g.x, g.y);
                ctx.lineTo(g.x * r + (this[i].x - scale) * (1 - r), g.y);
                
                switch(this[i].kind){
                    case 'out':
                        ctx.lineTo(g.x * r + (this[i].x - scale) * (1 - r), this[i].y);
                        ctx.lineTo(this[i].x, this[i].y);
                        break;
                    case 'not':
                        ctx.lineTo(g.x * r + (this[i].x - scale) * (1 - r), this[i].y - 0.35*scale + k/(n+1)*0.7*scale);
                        ctx.lineTo(this[i].x - (0.7*1.73/2 + 0.16) * scale, this[i].y - 0.35*scale + k/(n+1)*0.7*scale);
                        break;
                    case 'and':
                    case 'or':
                        ctx.lineTo(g.x * r + (this[i].x - scale) * (1 - r), this[i].y - 0.4*scale + k/(n+1)*0.8*scale);
                        ctx.lineTo(this[i].x - scale, this[i].y - 0.4*scale + k/(n+1)*0.8*scale);
                        break;
                }
                ctx.stroke();
            }
        }
    }
    play(){}
}

// half adder
const cir = new Circuit(
    [
        new Node('in', 0, 100),
        new Node('in', 0, 200),
        new Node('or', 100, 100),
        new Node('and', 100, 200),
        new Node('not', 200, 200),
        new Node('and', 300, 150),
        new Node('out', 400, 100),
        new Node('out', 400, 200)
    ],
    [
        [],
        [],
        [0, 1],
        [0, 1],
        [3],
        [2, 4],
        [5],
        [3]
    ]
);

export { Node, cir };