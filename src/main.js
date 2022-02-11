import { cir } from './circuit.js';
import './edit-circuit.js';
import './truth-table.js';

let alignButton = document.getElementById('align');
// let optimizeButton = document.getElementById('optimize');
// let playButton = document.getElementById('play');

alignButton.addEventListener(
    'click',
    function(){
        cir.align();
    }
)

cir.render();