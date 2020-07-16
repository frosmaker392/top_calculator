const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const operations = [add, subtract, multiply, divide];

//Choose an operation in operations array at index, then return
//the result of said operation with inputs a and b
function operate(a, b, index){
    if(index > 3) return null;

    return operations[index](a, b);
}

(function(){
    const displayNum = document.querySelector('#display-num');
    const numBtns = document.querySelectorAll(".calc-btn.num");
    const opBtns = document.querySelectorAll(".calc-btn.op");
    const modBtns = document.querySelectorAll(".calc-btn.mod");
    const equalBtn = document.querySelector(".calc-btn.eq");

    const maxCharCount = 10;
    let inputCharArr = [0];
    //charCount excludes '.'
    let charCount = 0;

    //True if decimal point is used
    let dp = false;
    //True if leftmost digit is a user-input zero
    let acceptZero = false;
    let negative = false;
    let userHasInput = false;
    
    //Memory array simulates actual calculator memory (kinda)
    let memory = [];

    displayNum.textContent = 0;

    function resetInput(){
        negative = false;
        userHasInput = false;
        dp = false;
        inputCharArr = [0];
        charCount = 0;
    }

    //Updates the display based on inputCharArr for no arguments
    //Formats the number argument and updates the display with the formatted number
    function updateDisplay(number = null){
        if(number === null){
            displayNum.textContent = inputCharArr.slice(0, 10).join('');
            return;
        }
        else{
            let displayText;
            
            const digitOffset = number < 0 ? 1 : 0;
            const exp = number === 0 ? 0 : Math.log10(Math.abs(number));
            if(exp > (10 - digitOffset)){
                displayText = number.toExponential(6 - digitOffset).replace('+', '');
            }
            else if(exp < (-9 + digitOffset)){
                displayText = number.toExponential(5 - digitOffset);
            }
            else{
                const absBelowOne = Math.abs(number) < 1;

                //subtract one more from precision if abs(number) < 1
                //as 0 is not counted as a significant figure
                //dividing by 1 somehow fixes the trailing zeroes
                displayText = number.toPrecision(10 - digitOffset - (absBelowOne ? 1 : 0)) / 1;
            }
            displayNum.textContent = displayText;
        }
    }

    //Stores the previous user entry as a number, then resets input field
    function storeNumber(){
        let num = NaN;

        num = inputCharArr === [] ? 0 : parseFloat(inputCharArr.join(''));

        if(memory.length === 2) memory.push(num);

        if(memory.length === 3){
            num = operate(memory[0], memory[2], +memory[1]);
        }
        memory = [];
        memory.push(num);

        // //Evaluate and store number if last element is an operator
        // if(memory.length === 2){
        //     memory.push(num);

        //     const evaluated = operate(memory[0], memory[2], +memory[1]);
        //     num = evaluated;
        //     memory = [evaluated];
        // }
        // //Otherwise reset memory and store number
        // else{
        //     if(memory.length === 3 && inputCharArr === []){
        //         num = operate(memory[0], memory[2], +memory[1]);
        //     }
        //     memory = [];
        //     memory.push(num);
        // }

        updateDisplay(num);
        resetInput();
    }

    function pushOperator(index){
        console.log(memory);
        if(index !== null){
            if(typeof(memory[1]) === typeof(""))
                memory[1] = index;
            else
                memory.push(index);
        }
    }

    //Adds a digit at the right of the displayNum value (num * 10 + digit)
    //Doesn't do anything if number of digits equal 10
    function addDigit(digitChar){
        if(charCount === maxCharCount) return;

        if(digitChar !== '0'){
            if(charCount !== 0){
                inputCharArr.push(digitChar);
            }
            else{
                inputCharArr[negative ? 1 : 0] = digitChar;
            }
            acceptZero = true;
            updateDisplay();
            charCount++;
        }
        else if(acceptZero){
            if(charCount !== 0)
                inputCharArr.push(digitChar);
            updateDisplay();
        }
        userHasInput = true;
    }

    //Adds decimal point, toggles dp to true
    //Does nothing if dp is already true
    function triggerDP(){
        if(dp || charCount === maxCharCount) return;

        if(charCount === 0){
            acceptZero = true;
            charCount++;
        }
        inputCharArr.push('.');
        updateDisplay();
        dp = true;
    }

    function togglePlusMinus(){
        if(negative){
            inputCharArr.shift();
            negative = false;
        }
        else{
            inputCharArr.unshift('-');
            negative = true;
        }
        updateDisplay();
    }

    //Removes last digit/dp in the display char array
    function backspace(){
        if(charCount === 0) return;

        const removedElement = inputCharArr.pop();
        if(removedElement === '.'){
            if(charCount === 1 && inputCharArr[0] === '0'){
                charCount--;
            }
            else{
                dp = false;
            }
        }
        else charCount--;

        if(charCount === 0){
            displayNum.textContent = 0;
            userHasInput = false;
            acceptZero = false;
        }
        else
            updateDisplay();
    }

    function clear(){
        //If input is empty
        if(charCount === 0 && !negative){
            memory = [];
            updateDisplay();
        }
        //otherwise reset entry
        else{
            resetInput();
            updateDisplay();
        }

        console.log(memory);
    }

    function sqrt(){
        let num = null;
        //If last element is an operator
        if(memory.length === 2 && !userHasInput){
            console.log('pop');
            memory.pop();
        }

        if(memory.length === 1){
            num = Math.sqrt(memory[0]);
            memory[0] = num;
        }
        else{
            num = Math.sqrt(parseFloat(inputCharArr.join('')));
            memory.push(num);
        }

        userHasInput = false;
        resetInput();
        updateDisplay(num);
    }
    
    numBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            addDigit(e.target.id);
        });
    });
       
    opBtns.forEach((btn) => {
        btn.addEventListener('click', (e)=>{
            if(userHasInput)
                storeNumber();
            pushOperator(e.target.getAttribute('data-op'));
        });
    });

    modBtns.forEach((btn) => {
        let onClick = () => {console.log("Mod button not implemented!")};
        switch(btn.id){
            case 'point':
                onClick = triggerDP;
                break;
            case 'back':
                onClick = backspace;
                break;
            case 'plusminus':
                onClick = togglePlusMinus;
                break;
            case 'ac-ce':
                onClick = clear;
                break;
            case 'sqrt':
                onClick = sqrt;
                break;
        }

        btn.addEventListener('click', onClick);
    });
    
    equalBtn.addEventListener('click', () => {
        if(userHasInput)
            storeNumber();
        pushOperator(null);
    });
})();

