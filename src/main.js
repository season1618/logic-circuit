import { cir } from './circuit.js';
import './canvas-event.js';
import { tt } from './truth-table.js';
import { DNF, CNF, MINIMIZE, CIRCUIT_FORM, setCircuitForm } from './table-event.js';

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
        setCircuitForm(DNF);
        let [nodeArray, inputArray, nodeGridPos] = tt.getDNF();
        cir.setCircuit(nodeArray, inputArray);
        cir.align(nodeGridPos);
        cir.render();
    }
);

document.getElementById('cnf').addEventListener(
    'click',
    function(){
        setCircuitForm(CNF);
        let [nodeArray, inputArray, nodeGridPos] = tt.getCNF();
        cir.setCircuit(nodeArray, inputArray);
        cir.align(nodeGridPos);
        cir.render();
    }
);

document.getElementById('minimize').addEventListener(
    'click',
    function(){
        setCircuitForm(MINIMIZE);
        if(tt.nOutput == 1){
            let [nodeArray, inputArray, nodeGridPos] = tt.getMinimum();
            cir.setCircuit(nodeArray, inputArray, nodeGridPos);
            cir.align(nodeGridPos);
            cir.render();
        }
    }
)

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