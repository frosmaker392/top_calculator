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
    const calcBtns = document.querySelectorAll(".calc-btn");

    const maxCharCount = 10;
    let inputCharArr = [0];
    //charCount excludes '.'
    let charCount = 0;

    //True if decimal point is used
    let dp = false;
    //True if leftmost digit is a user-input zero
    let acceptZero = false;
    let negative = false;

    //Previous entry and current operator stored in memory
    let storedNumber = null;
    let operatorIndex = null;

    displayNum.textContent = 0;

    function resetInput(){
        negative = false;
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
        if(storedNumber === null){
            storedNumber = parseFloat(inputCharArr.join(''));
        }
        else{
            if(charCount !== 0)
                storedNumber = operate(storedNumber, parseFloat(inputCharArr.join('')), operatorIndex);
        }

        console.log(storedNumber);
        updateDisplay(storedNumber);

        resetInput();
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
            acceptZero = false;
        }
        else
            updateDisplay();
    }

    function clear(){
        //If input is empty, then clear storedNumber and operatorIndex
        if(charCount === 0 && !negative){
            storedNumber = null;
            operatorIndex = null;
            updateDisplay();
        }
        //otherwise reset entry
        else{
            resetInput();
            updateDisplay();
        }
    }

    calcBtns.forEach((btn) => {
        if(btn.classList.contains('num')){
            btn.addEventListener('click', (e) => {
                addDigit(e.target.id);
            });
        }
        else if(btn.classList.contains('op')){
            btn.addEventListener('click', (e)=>{
                storeNumber();
                operatorIndex = +e.target.getAttribute('data-op');
            });
        }
        else if(btn.classList.contains('mod')){
            let onClick;
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
            }

            btn.addEventListener('click', onClick);
        }
    });
})();

