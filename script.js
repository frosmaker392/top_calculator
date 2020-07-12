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

    displayNum.textContent = 0;
    let displayValue = 0;
    //True if decimal point is used
    let dp = false;

    //Adds a digit at the right of the displayNum value (num * 10 + digit)
    //Doesn't do anything if displayValue is more than 10 digits long
    function addDigit(digit){
        if(digit > 9) throw new Error('digit cannot be greater than 10!');
        if(displayValue > 999999999) return;
    
        displayValue = displayValue * 10 + digit;
        displayNum.textContent = displayValue;
    }

    //Adds decimal point, toggles dp to true
    //Does nothing if dp is already true
    function triggerDP(){
        if(dp) return;
        //TODO
        dp = true;
    }

    calcBtns.forEach((btn) => {
        if(btn.classList.contains('num')){
            btn.addEventListener('click', (e) => {
                addDigit(+e.target.id);
            });
        }
        else if(btn.classList.contains('op')){
            //TODO
        }
        else if(btn.classList.contains('mod')){
            switch(btn.id){
                case 'point':
                    triggerDP();
                    break;
            }
        }
    });
})();

