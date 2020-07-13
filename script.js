const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const operations = [add, subtract, multiply, divide];

//Choose an operation in operations array at index, then return
//the result of said operation with inputs a and b
function operate(a, b, index){
    if(index > 3) return null;

    const s = operations[index](a, b);
    console.log(s);
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

    displayNum.textContent = 0;

    function updateDisplay(){
        displayNum.textContent = displayCharArr.join('');
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
        if(dp) return;

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
            //TODO
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

