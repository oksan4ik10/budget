function isNum(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}


const calc=document.getElementById("start"),
cancel=document.getElementById("cancel"),
buttonPlus1=document.getElementsByTagName("button")[0],
buttonPlus2=document.getElementsByTagName("button")[1],
check=document.getElementById("deposit-check"),

//right
budgetDayValue=document.getElementsByClassName("budget_day-value")[0],
budgetMonthValue=document.getElementsByClassName("budget_month-value")[0],
expensesMonth=document.getElementsByClassName("expenses_month-value")[0],
incomeValue=document.getElementsByClassName("additional_income-value")[0],
addExpenses=document.getElementsByClassName("additional_expenses-value")[0],
accumulation=document.getElementsByClassName("income_period-value")[0],
missionMonth=document.getElementsByClassName("target_month-value")[0],

resultTotal=document.querySelectorAll(".result-total"), //для куки

//left

money=document.querySelector(".salary-amount"),
incomeTitle=document.querySelector(".income-title"),
addincomeItems=document.querySelectorAll(".additional_income-item"),
expensesTitle=document.querySelector(".expenses-title"),
expensesAmount=document.querySelector(".expenses-amount"),
addExpensesItem=document.querySelector(".additional_expenses-item"),
targetAmount=document.querySelector(".target-amount"),
period=document.querySelector(".period-select"),
//deposit
depositAmount=document.querySelector(".deposit-amount"),
depositPercent=document.querySelector(".deposit-percent"),
depositBank=document.querySelector(".deposit-bank"),


periodAmount=document.querySelector(".period-amount"),

inputText=document.querySelectorAll("input[type=text] "); //все инпуты с типом текст для блокировки и разблокировки


//поля доходы и обязательные расходы
let incomeItems=document.querySelectorAll(".income-items"),
expensesItems=document.querySelectorAll(".expenses-items");



//для добавления пустых инпутов (дополнительный доход, обязательные расходы)
const expItem=expensesItems[0].cloneNode(true),
incItem=incomeItems[0].cloneNode(true);

class AppData{
    constructor(){


    this.incomeMonth=0;
    this.addIncome=[];

    this.addExpenses=[];
    this.mission="";
    this.deposit=false;


    this.period=0;
    this.budgetDay=0;
    this.budgetMonth=0;
    this.expensesMonth=0;
    this.percentDeposit=0;
    this.moneyDeposit=0;

    //стали не нужны после объединение двух методов
        // this.income={}; //дополнительный заработок
        // this.expenses={};
    }
        start(){
            
            //проверка на пустое поле месячный доход
            if (money.value===""){         
                calc.disabled=true;
                return
            }

            this.getDeposit();
            //проверка на поле Deposit
            if (!(isNum(this.percentDeposit) &&(this.percentDeposit>=0&&this.percentDeposit<=100))){
                alert("нееет!");
                return

            }

            this.getExpensIncome();
            // this.getExpensesMonth();
            // this.getIncomeMonth();
            this. getAddExpInc();
            // this.getAddExpenses();
            // this.getAddIncome();
            this.getDeposit();
            this.getBudget();
            this.getTargetMonth();
            this.showResult();
           res();
            this.addIncome=[];
            this.saveCookie();
   
              
        }


    //один метод вместо двух getExpensesMonth() и getIncomeMonth() 
        getExpensIncome(){
            let summa=(items)=>{
                let newOb={};
                
                items.forEach((el)=>{
                    let nameClass=el.className.split("-")[0],
                    nameProperty=el.querySelector(`.${nameClass}-title`).value.trim(),
                    nameValue=el.querySelector(`.${nameClass}-amount`).value.trim();
                    newOb[nameProperty]=nameValue
                })
                let sum=0;
                for(let key in newOb){
                    if(!isNaN(newOb[key])){
                        sum+=+newOb[key]; 
                    }      
                }
                return sum;
            
            }
            // expensesItems.forEach(summa);
            // incomeItems.forEach(summa);
            this.expensesMonth=summa(expensesItems);
            this.incomeMonth=summa(incomeItems);  

        }


        //один метод вместо двух getAddExpenses() и getAddIncome()
        getAddExpInc(){
            const addItem=(newArr)=>{
                let arr=[];
                newArr.forEach((el)=>{
                    
                    el=el.trim();
                    if (el!=="") arr.push(el);
                })
               return arr;
            }
            
            let arrAddIncome=[];
            addincomeItems.forEach((el) => arrAddIncome.push(el.value))
            this.addIncome=addItem(arrAddIncome);
            this.addExpenses=addItem(addExpensesItem.value.split(","));

        }

        getDeposit(){
            if(this.deposit){
                this.percentDeposit=depositPercent.value;
                this.moneyDeposit=depositAmount.value;
            }
            
        }

        depositChange(){
            const proc=this.value; 
            if(this.value==="other"){
                depositPercent.value="";
                depositPercent.style.display="inline-block";
                depositPercent.addEventListener("change",()=>{
                    calc.disabled=false;
                    
                })
            }else{
                depositPercent.style.display="none";
                depositPercent.value=this.value;
            };
        }

        
        getDepositBlock(){
            if (check.checked){
                depositBank.style.display="inline-block";
                depositAmount.style.display="inline-block";
                this.deposit=true;
                depositBank.addEventListener("change",this.depositChange)

            }else{
                depositBank.style.display="none";
                depositAmount.style.display="none";
                depositPercent.style.display="none";
                depositBank.value="";
                depositAmount.value="";
                this.deposit=false;
                depositBank.removeEventListener("change",this.depositChange.bind(this))
            }
                        
        }

         getBudget(){
            this.budgetMonth=(+money.value+this.incomeMonth)-this.expensesMonth+(this.moneyDeposit*this.percentDeposit/100);
            this.budgetDay=(this.budgetMonth/30).toFixed(2);   
          }
          getTargetMonth() {
            let target=parseFloat(targetAmount.value);
            if (!isNaN(target)){
                let res=target/appData.budgetMonth;
                let str=(res>0)?  Math.ceil(res):"Цель не будет достигнута"
                appData.mission=str;
            }
          } 
          showResult(){
            expensesMonth.value=this.expensesMonth;
            addExpenses.value=this.addExpenses.join(", ");
            incomeValue.value=this.addIncome.join(", ");
            
            budgetDayValue.value=this.budgetDay;
            budgetMonthValue.value=this.budgetMonth;
            accumulation.value=+this.budgetMonth*period.value;  
            period.addEventListener("input",()=>accumulation.value=this.budgetMonth*period.value)
            missionMonth.value=this.mission;
          }


        //сохранение куки
        saveCookie(){
            const newOb={}
            resultTotal.forEach((el,index)=>{
                setCookie(index,el.value);
                localStorage[index]=el.value;
            });
        arr=coockNameArr(document.cookie).sort()  //запомнить куки в массив
        }

            
}

const appData=new AppData ();

let arr=coockNameArr(document.cookie).sort(); //записать все куки в массив
//функция рассчитать
const res=()=>{

    inputText.forEach((el)=>el.readOnly=true); //блокировать все input
    calc.disabled=false;
    calc.style.display="none";
    cancel.style.display="block"; //кнопка сбросить    
    depositAmount.disabled=true;
    check.disabled=true;
    depositBank.disabled=true;
    buttonPlus1.disabled=true;
    buttonPlus2.disabled=true;
}



//для обнуления значений запомним начальное состояние appData
const oldAppData={}
 for(key in appData){
     oldAppData[key]=appData[key];
 }



//функции для добавления новых полей по клику по +
const addExpensesValue=()=>{
    let newEl=expItem.cloneNode(true);
    if (expensesItems.length<3){
       expensesItems[expensesItems.length-1].parentNode.insertBefore(newEl,buttonPlus2);
    }
    expensesItems=document.querySelectorAll(".expenses-items")                      
};

const addIncomeValue=()=>{
    let newItem=incItem.cloneNode(true);
    if (incomeItems.length<3){
       incomeItems[0].parentNode.insertBefore(newItem,buttonPlus1);
    }
    incomeItems=document.querySelectorAll(".income-items")   
};


//функция для сброса
cancelAll=()=>{
    let inputAll=document.querySelectorAll("input");
    inputAll.forEach((el)=>{
        if (el.type==="range") el.value=1
        else el.value="";
    });
    for(key in appData){
        appData[key]=oldAppData[key];
    }
    inputText.forEach((el)=>el.readOnly=false);
    
    //сброс депозита
    depositAmount.disabled=false;
    check.disabled=false;
    depositBank.disabled=false;
    check.checked=false;
    appData.getDepositBlock();
    calc.style.display="block";
    buttonPlus1.disabled=false;
    buttonPlus2.disabled=false;
    
    cancel.style.display="none"; //кнопка сбросить 


    arr.forEach((el)=>{
        deleteCookie(String(el));
        console.log(document.cookie);
        
    }); //удалить все куки
    arr.forEach((el)=>{localStorage.removeItem(el)}) //удалить все из локального хранилища

}



//сброс всех инпутов
cancel.addEventListener("click",cancelAll)



calc.addEventListener("click",appData.start.bind(appData));//привязка к контексту

money.addEventListener("input",()=>calc.disabled=false)
depositPercent.addEventListener("input",()=>calc.disabled=false)


buttonPlus1.addEventListener("click",addIncomeValue);
buttonPlus2.addEventListener("click",addExpensesValue);
period.addEventListener("input",()=>periodAmount.textContent=period.value);
check.addEventListener("change",appData.getDepositBlock.bind(appData))


 //запрет ввода 
const nameWords=document.querySelectorAll("input[placeholder='Наименование']"),
nameSum=document.querySelectorAll("input[placeholder='Сумма']");

nameWords.forEach((el)=>{
        el.addEventListener("input",(e)=>{
           e.target.value=e.target.value.replace(/([A-Z])|(\d)/gi,"");
        })
})
nameSum.forEach((el)=>{
    el.addEventListener("input",(e)=>{
        e.target.value=e.target.value.replace(/\D/g,"");
    })
})


//куки
// document.cookie="name=kkk";

//если пользователь вручную удалит что-то из локального хранилища, то идет сброс всего
if(arr.length!==localStorage.length) cancelAll();


//если в куках что-то есть, до добавляем на страницу и блокируем левую часть
if (document.cookie){
    resultTotal.forEach( (el,index)=>{
        el.value=getCookie(String(index))
    }

    )
    res();

}

//ищет значение по имени куки
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  //удаление куки
  function deleteCookie ( cookie_name )
  {
      setCookie(cookie_name,getCookie(cookie_name),1992,12,12)
        
  }


  //установка куки
  function setCookie(key, value, year,month,day) {
      let cookieStr=key+"="+value;
      if(year){
          const expires=new Date(year,month,day)
          cookieStr+="; expires=" + expires.toGMTString();
          
      }  
      document.cookie=cookieStr;

  }


//создает массив из имён куки
function coockNameArr(str){
    let arr=str.split("; ")
    let newArr=[];
    arr.forEach((el)=>{
        let coockName="";
        for (let i=0; i<el.length;i++){
            if (el[i]!=="=") coockName+=el[i];
            else break;
        }
        newArr.push(coockName);
    })
    return newArr;
}


