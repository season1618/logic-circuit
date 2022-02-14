import { cir } from './circuit.js';
import './edit-circuit.js';
import { tt } from './truth-table.js';
import './table-event.js';

//document.getElementById('optimize');
// let playButton = document.getElementById('play');

document.getElementById('align').addEventListener(
    'click',
    function(){
        cir.align();
        cir.render();
        tt.setTable(...cir.getTruthTable());
    }
);

document.getElementById('dnf').addEventListener(
    'click',
    function(){
        let [nodeArray, inputArray, nodeGridPos] = tt.getDNF();
        cir.setCircuit(nodeArray, inputArray);
        cir.align(nodeGridPos);
        cir.render();
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
        ['in'],
        ['in'],
        ['or'],
        ['and'],
        ['not'],
        ['and'],
        ['out'],
        ['out']
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
cir.align();
cir.render();
tt.setTable(...cir.getTruthTable());