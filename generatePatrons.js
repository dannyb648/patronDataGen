const basePeople = require('./basePeople.js')


var makeTime = function(timestamp){
  var a = new Date(timestamp * 1000);
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = ((hour > 9) ? hour : "0"+hour) + ':' + ((min > 9) ? min : "0"+min) + ':' + ((sec > 10) ? sec : "0"+sec) ;
  return time;
}

var calcPace = function(age){
	return 2 - (Math.round((age / 100) * 10) / 10)
}

var genPeople = function(amount){
	var patrons = []
	for(var i = 0; i < amount; i++){
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
 

var pub = {
	'times' : {
		'openingTime': 1520676000, 
		'closingTime': 1520730000,
		'timePeriod': 1520730000 - 1520676000,
		'interval': (60 * 5)
		},
	'seats' : [
		{'id': 'table1', 'seated': [], 'max': 4},
		{'id': 'table2', 'seated': [], 'max': 4},
		{'id': 'table3', 'seated': [], 'max': 4},
		{'id': 'table4', 'seated': [], 'max': 4},
		{'id': 'table5', 'seated': [], 'max': 4},
		{'id': 'booth1', 'seated': [], 'max': 8},
		{'id': 'booth2', 'seated': [], 'max': 8},
		{'id': 'booth3', 'seated': [], 'max': 4},
		{'id': 'bar', 'seated': [], 'max': 8},
		{'id': 'bench', 'seated': [], 'max': 8}
	], 
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

var spawnGroup = function(patrons, time){
	//generate random table to use
	var seat = Math.floor(Math.random() * 10)
	//calculate the target age for this seat (age / time corrolation)
	var targetAge = (time + 100) - (time * 2)
	//set age to 18 if underage picked
	if(targetAge < 18){
		targetAge = 18
	}
	//If the seat is empty
	if(pub.seats[seat].seated.length == 0){
		console.log(" - -  Actually Spawning Group")
		//filter a potential list of aged drinkers
		var potential = patrons.filter(function(o){
			return o.age <= targetAge + 5 && o.age >= targetAge - 5
		})
		//for the entire table
		for(var i = 0; i < pub.seats[seat].max; i++)
			if(potential[i]){
				//push one from potential stack to seated
				pub.seats[seat].seated.push(potential[i])
				//remove this person from the patrons stack
				patrons = patrons.filter(function(r){
					return r._id != potential[i]._id
				})
			}
	} else {
		console.log(" - - Seat is already taken")
	}
	return patrons
}

/*var oldestTable = function(){
	var oldest = 'Z';
	var oldestAge = 0;
	for(var table = 0; table < pub.seats.length; table++){
		console.log("xxxxxxxxxxxxxxxxx")
		var tableAge = 0;
		for(var seat = 0; seat < pub.seats[table].seated.length; seat++){
			console.log("TABLE FILLED" + pub.seats[table].seated.length)
			if(pub.seats[table].seated.length > 0){
				if(pub.seats[table].seated[seat] == undefined){
					console.log(table + " undefined")
				}
				//console.log("SEAT" + seat)
				//console.log("IN SEAT" + pub.seats[table].seated[seat])
				//console.log("IN SEAT AGE: " + seat + " : " + pub.seats[table].seated[seat].age)
				//tableAge = tableAge + pub.seats[table].seated[seat].age
			}
		}
		//tableAge = tableAge / pub.seats[seat].max
		//if(tableAge > oldestAge){
		//	oldest = seat
		//}
	}
	return oldest
}  */

var removeGroup = function(patrons, time){
	//pick seat to vacate
	var seat = Math.floor((Math.random() * pub.seats.length) + 0)

	if(pub.seats[seat].seated.length = pub.seats[seat].max){
		
		console.log(" - - Removing Table:" + seat)
		
		//console.log("#" + makeTime(i) + ": Actually Removing Group")
		var toPop = pub.seats[seat].seated.length
		for(j = 0; j < toPop; j++){
			pub.seats[seat].seated.pop()
		}
	} else {
		console.log(" - - Table not full: " + seat)
	}
}

var calcEvents = function(i, usedSpace, factors){
	var seedSpawn = Math.floor((Math.random() * 100) + 0)
	var seedLeave = Math.floor((Math.random() * 100) + 0)
	var hour = new Date(i * 1000).getHours();
	var spawn = 20
	var leave = 20
	
	if(hour > 10 && hour < 12){
		spawn = spawn + 0 
		leave = leave + 0
	} else if(12 <= hour && 14 > hour){
		spawn = spawn + 30
		leave = leave + 0
	} else if(14 <= hour && 17 > hour){
		spawn = spawn + 10
		leave = leave + 40
	} else if(17 <= hour && 20 > hour){
		spawn = spawn + 20
		leave = leave + 0
	} else if(20 <= hour && 22 >= hour){
		spawn = spawn + 40
		leave = leave - 10
	} else if(hour == 23){
		spawn = spawn + 30
		leave = leave + 20
	} else if(hour == 0){
		leave = leave + 50
		spawn = 0
	}

	var events = {'spawn': (spawn > seedSpawn ? true : false), 'leave': (leave > seedLeave ? true : false)}

	return events

}



var gen = function(patrons){
	
	for(var i = pub.times.openingTime; i < pub.times.closingTime; i = i + (60 * 5)){	
		/*
		SEAT PEOPLE
		*/
		//calcualte the remaining capacity in the pub as a percentage.
		//console.log("CAP" + pub.calcCapacity(pub.seats))
		var usedSpace = Math.floor((pub.calcCapacity(pub.seats) * 100) / pub.calcMaxCapacity(pub.seats))
		var time = Math.floor(((i - pub.times.openingTime) * 100) / (pub.times.closingTime - pub.times.openingTime))

		console.log("#" + makeTime(i) + ": Percentage of Used Space: " + usedSpace + "%") 
		
		

		//RETHINK THIS LOGIC, IT DOESNT WORK! 

		//if rng 0 - 100 is less than percentage of capacity left... 

		var events = calcEvents(i, usedSpace, {})

		if(events.leave){
			console.log(" - Remove Group Attempt")
			removeGroup(patrons, time)
		} 

		if (events.spawn){
			console.log(" - Add Group Attempt")
			patrons = spawnGroup(patrons, time)
		}

		

	}
	console.log("FINAL STATE")
	for(i = 0; i < pub.seats.length; i++){
		console.log(pub.seats[i])
	}

}


var patrons = genPeople(1000)
//console.log(patrons)
console.log(gen(patrons))
