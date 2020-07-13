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

    let displayCharArr = [0];
    let digitCount = 0;

    //True if decimal point is used
    let dp = false;
    //True if leftmost digit is a zero
    let rejectZero = true;

    let storedNumber = null;
    let operatorIndex = null;

    displayNum.textContent = 0;

    function updateDisplay(number = null){
        if(number === null){
            displayNum.textContent = displayCharArr.join('');
            return;
        }
        else{
            let displayText;

            const isNegative = number < 0;
            const exp = number === 0 ? 0 : Math.log10(Math.abs(number));
            if(exp > (isNegative ? 9 : 10)){
                displayText = number.toExponential(isNegative ? 5 : 6).replace('+', '');
            }
            else if(exp < (isNegative ? -8 : -9)){
                displayText = number.toExponential(isNegative ? 4 : 5);
            }
            else{
                //dividing by 1 somehow fixes the trailing zeroes
                displayText = number.toPrecision(isNegative ? 9 : 10) / 1;
            }
            displayNum.textContent = displayText;
        }
            
    }

    function storeNumber(){
        if(storedNumber === null){
            storedNumber = parseFloat(displayCharArr.join(''));
            console.log(storedNumber);
        }
        else{
            storedNumber = operate(storedNumber, parseFloat(displayCharArr.join('')), operatorIndex);
        }

        updateDisplay(storedNumber);

        dp = false;
        displayCharArr = [0];
        digitCount = 0;
    }

    //Adds a digit at the right of the displayNum value (num * 10 + digit)
    //Doesn't do anything if number of digits equal 10
    function addDigit(digitChar){
        if(digitCount === 10) return;

        if(!rejectZero || digitChar !== '0'){
            if(digitCount !== 0){
                displayCharArr.push(digitChar);
            }
            else{
                displayCharArr[0] = digitChar;
            }
            updateDisplay();
            digitCount++;
            rejectZero = false;
        }
    }

    //Adds decimal point, toggles dp to true
    //Does nothing if dp is already true
    function triggerDP(){
        if(dp || digitCount === 10) return;

        if(digitCount === 0){
            rejectZero = false;
            digitCount++;
        }
        displayCharArr.push('.');
        updateDisplay();
        dp = true;
    }

    //Removes last digit/dp in the display char array
    function backspace(){
        if(digitCount === 0) return;

        const removedElement = displayCharArr.pop();
        if(removedElement === '.'){
            if(digitCount === 1 && displayCharArr[0] === '0'){
                digitCount--;
            }
            else{
                dp = false;
            }
        }
        else digitCount--;

        if(digitCount === 0){
            displayNum.textContent = 0;
            rejectZero = true;
        }
        else
            updateDisplay();
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
            }

            btn.addEventListener('click', onClick);
        }
    });
})();

