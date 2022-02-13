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
        tt.setTable(...cir.getTruthTable());
    }
);

document.getElementById('dnf').addEventListener(
    'click',
    function(){
        cir.setCircuit(...tt.getDNF());
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
        ['in', 0, 100],
        ['in', 0, 200],
        ['or', 100, 100],
        ['and', 100, 200],
        ['not', 200, 200],
        ['and', 300, 150],
        ['out', 400, 100],
        ['out', 400, 200]
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
tt.setTable(...cir.getTruthTable());