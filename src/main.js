import { Node, cir } from './circuit.js';
import './edit-circuit.js';
import { truthTable } from './truth-table.js';

// let optimizeButton = document.getElementById('optimize');
// let playButton = document.getElementById('play');

document.getElementById('align').addEventListener(
    'click',
    function(){
        cir.align();
    }
);

document.getElementById('png').addEventListener(
    'click',
    function(){
        let anchor = document.createElement('a');
        anchor.href = canvas.toDataURL();
        anchor.download = 'logic-circuit.png';
        anchor.click();
    }
);

// half adder
cir.setCircuit(
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
cir.render();
truthTable.setTable(...cir.getTruthTable());