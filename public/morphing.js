const wait = async (ms) => {
    return new Promise(
        (resolve) => {
            setTimeout(() => { resolve(); }, ms)
        }
    );
}

async function morphing(){
    let nInput = document.querySelector("tbody tr").children.length - 1;
    for(let i = 1; i < (1 << (1 << nInput)); i++){
        await wait(100);
        let d = (i-1) ^ ((i-1) >> 1) ^ i ^ (i >> 1) ;
        for(let j = 0; j < (1 << nInput); j++){
            if((d >> j) & 1){
                document.querySelector("td[row='" + j + "'][column='" + nInput + "']").click();
            }
        }
    }
}

morphing();