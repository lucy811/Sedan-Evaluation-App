// BESTBUY CONTROLLER
var bestbuyController = (function() {
    
    var Cost = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    var Performance = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Ratio = function(description, percentage) {
        this.description = description;
        this.percentage = percentage;
    };

    var data = {
        allItems: {
            cost: [],
            performance: []
        },

        percentage: -1,
        allPercentages: []
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // [1 3 5 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'performance' or 'cost' type
            if (type === 'cost') {
                newItem = new Cost(ID, des, val);
            } else if (type === 'performance') {
                newItem = new Performance(ID, des, val);
            }
            
            // Push it into our array
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            // data.allItems[type][id];
            // ids = [1 2 4 8]
            // index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculatePercentages: function() {
            var newRatio;
      
            for(j =0; j<data.allItems.cost.length; j++){
                for(i =0; i<data.allItems.performance.length; i++){
                    if(data.allItems.performance[i].description === data.allItems.cost[j].description){
                        if(data.allItems.cost[j].value !== 0){
                            data.percentage = Math.round((data.allItems.performance[i].value / data.allItems.cost[j].value) * 100);
                        } else {
                            data.percentage = -1;
                        }
                      
                       newRatio = new Ratio(data.allItems.cost[j].description, data.percentage);

                       data.allPercentages.push(newRatio);
                    }
                }
            }
        },
    
        // Selection Sort;
        getRankings: function(){

            bestbuyController.calculatePercentages();

            var length = data.allPercentages.length;
            for(var i = 0; i< length - 1; i++){
                var max = i;
                for(var j = i+1; j<length; j++){
                    if(data.allPercentages[j].percentage>data.allPercentages[max].percentage){
                        max = j;
                    }
                }

                if(max !== i){
                    var temp = data.allPercentages[i];
                    data.allPercentages[i] = data.allPercentages[max];
                    data.allPercentages[max] = temp;
                }
            }
       
            return data.allPercentages;
        },
    };
    
})();


// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        performanceContainer: '.performance__list',
        costsContainer: '.costs__list',
        rankingsContainer: '.ranking__list',
        bestbuyLabel: '.bestbuy__value',
        container: '.container',
        dateLabel: '.bestbuy__title--year',
        rankingBtn: '.ranking__btn'
    };
    
    
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type, formatNum;
  
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
             //e.g input 34920, output 34,920
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        if(type === 'cost'){
            formatNum = '-' + ' ' + int + '.' + dec;
        }else if(type === 'performance'){
            formatNum = '+' + ' ' + int + '.' + dec;
        }else {
            formatNum = int + '.' + dec;
        }

        return formatNum;
    };
    
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    
    return {
        getInput: function() {
            return {
                // Will be either performance or cost
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        
        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'performance') {
                element = DOMstrings.performanceContainer;
                
                html = '<div class="item clearfix" id="performance-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button></div></div></div>';
            } else if (type === 'cost') {
                element = DOMstrings.costsContainer;
                
                html = '<div class="item clearfix" id="cost-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            
            el.parentNode.removeChild(el);
            
        },
        
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
    
        displayRankings: function() {
            var html, newhtml, element, bestCar;

            Rankings = bestbuyController.getRankings();

            for(i=0; i<Rankings.length; i++){
                element = DOMstrings.rankingsContainer;
                html = '<div class="item clearfix" id="performance-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__percentages">%percentage%</div></div></div>';
                
                // Replace the placeholder text with some actual data
                newHtml = html.replace('%id%', i);
                newHtml = newHtml.replace('%description%', Rankings[i].description);
                
                if(Rankings[i].percentage > 0){
                    newHtml = newHtml.replace('%percentage%', formatNumber(Rankings[i].percentage)+"%");
                } else {
                    newHtml = newHtml.replace('%percentage%', '---');
                }
            
                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            }

            bestCar = DOMstrings.bestbuyLabel;
            document.querySelector(bestCar).textContent = Rankings[0].description;

            rankingBtn = DOMstrings.rankingBtn;
            document.querySelector(rankingBtn).disabled = true;
        },

        displayYear: function() {
            var now, year;
            
            now = new Date();
       
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = year;
        },
        
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();

// MAIN CONTROLLER
var controller = (function(bestbuyCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.rankingBtn).addEventListener('click', UICtrl.displayRankings);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);        
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the bestbuy controller
            newItem = bestbuyCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

        }
    };
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //performance-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete the item from the data structure
            bestbuyCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
        }
    };
    
    
    return {
        init: function() {
            console.log('Application has been initialized.');
            UICtrl.displayYear();
            setupEventListeners();
        }
    };
    
})(bestbuyController, UIController);

controller.init();