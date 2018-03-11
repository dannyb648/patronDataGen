const basePeople = require('./basePeople.js')

var calcPace = function(age){
	return 2 - (Math.round((age / 100) * 10) / 10)
}

var genPeople = function(amount){
	var patrons = []
	for(i = amount; i < 100; i++){
		var age = Math.floor(Math.random() * (100 - 18) ) + 18;
		var person = {
						'_id': i.toString(),
						'name': basePeople[i].name,
						'gender': basePeople[i].gender,
						'age': age, 
						'beverage': basePeople[i].beverage,
						'x': 10,
						'y': 200,
						'state':
						{
							'drinkLevel': 0, 
							'pace': calcPace(age),
							'leaving': false,
							'seated': false,

						}
					};
		patrons.push(person)
	}
	return patrons;
};
 

var calcMaxCapacity = function(seats){
	var sum = 0;
	for (var key in seats) {
	    if (seats.hasOwnProperty(key)) {
	        sum = sum + seats[key].max;
	    }
	}
	return sum
}

var pub = {
	'times' : {
		'openingTime': 1520676000, 
		'closingTime': 1520730000,
		'timePeriod': this.closingTime - this.openingTime,
		'interval': (60 * 5)
		},
	'seats' : {
		'table1': {'seated': [1,2,3,4], 'max': 4},
		'table2': {'seated': [], 'max': 4},
		'table3': {'seated': [], 'max': 4},
		'table4': {'seated': [], 'max': 4},
		'table5': {'seated': [], 'max': 4},
		'booth1': {'seated': [], 'max': 8},
		'booth2': {'seated': [], 'max': 8},
		'booth3': {'seated': [], 'max': 4},
		'bar': {'seated': [], 'max': 8},
		'bench': {'seated': [], 'max': 20}
	}, 
	'calcCapacity' : function(seats){
		var sum = 0;
		for (var key in seats) {
	    	if (seats.hasOwnProperty(key)) {
	     		sum = sum + seats[key].seated.length;
	    	}
		}
		return sum
	},
	'calcMaxCapacity' : function(seats){
		var sum = 0;
		for (var key in seats) {
		    if (seats.hasOwnProperty(key)) {
		        sum = sum + seats[key].max;
		    }
		}
		return sum
	}
}

var genEnter = function(patrons, seats, capRemaining){
	var enterSeed = Math.floor(Math.random() * (100 - capRemaining) ) + capRemaining
	if(enterSeed > 75){

	}
}

var gen = function(patrons, pub){
	for(i = pub.times.openingTime; i < pub.times.closingTime; i = i + pub.times.interval){
		var max = pub.calcMaxCapacity(pub.seats)
		var cap = pub.calcCapacity(pub.seats)
		if(max - cap == 0){
			console.log("0%")
		} else {
			if((max - cap) < (max / 4)){
				console.log("remaining cap 1-25%")
			} else if((max - cap) < (max / 2)){
				console.log("Remining cap 26-50%")
			} else if((max - cap) < ((max / 4)* 3)){
				console.log("Remaining cap 51-75%")
			} else {
				console.log("Remaining cap 76-100%")
			}
		}
		console.log(i)

	}
}


var patrons = genPeople(100)
console.log(gen(patrons, pub))