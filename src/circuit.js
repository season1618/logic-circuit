const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

var scale = 100;

class Node {
    constructor(kind, value, x, y){
        this.kind = kind;
        this.value = value;
        this.depth = 0;
        this.x = x;
        this.y = y;
    }
    // calcDepth(){
    //     for(let i = 0; i < this.input.length; i++){
    //         this.depth = max(this.depth, this.input[i].depth);
    //     }
    // }
    include(x, y){
        if(this.x - scale < x && x < this.x && Math.abs(y - this.y) < 0.4*scale){
            console.log('hello');
            return true;
        }else return false;
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
        this.input = inputArray;
        this.h = 100;
        this.w = 10;
        this.depthCount;
    }
    calcDepth(){
        len = this.length;
        visits = new Array(len).fill(0);
        for(let i = 0; i < len; i++){
            if(visits[i] == 0){
                this[i].calcDepth();
                visits[i] = 1;
            }
        }
    }
    render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < this.length; i++){
            this[i].render();
            let n = this.input[i].length;
            let k = 0;
            for(let j of this.input[i]){
                let r = Math.random();
                k++;
                ctx.beginPath();
                ctx.moveTo(this[j].x, this[j].y);
                ctx.lineTo(this[j].x * r + (this[i].x - scale) * (1 - r), this[j].y);
                ctx.lineTo(this[j].x * r + (this[i].x - scale) * (1 - r), this[i].y - 0.4*scale + k/(n+1)*0.8*scale);
                ctx.lineTo(this[i].x - scale, this[i].y - 0.4*scale + k/(n+1)*0.8*scale);
                ctx.stroke();
            }
        }
    }
    play(){}
}

const cir = new Circuit(
    [
        new Node('in', 0, 100, 100),
        new Node('in', 1, 100, 200),
        new Node('and', 0, 300, 100),
        new Node('or', 0, 300, 200)
    ],
    [
        [],
        [],
        [0, 1],
        [0, 1]
    ]
);

export { Node, canvas, ctx, cir, scale };