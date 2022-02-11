import { cir } from './circuit.js';
import './edit-circuit.js';
import './truth-table.js';

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

cir.render();