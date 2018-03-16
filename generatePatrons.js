const basePeople = require('./basePeople.js')


var makeTime = function(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = hour + ':' + min + ':' + sec ;
  return time;
}

var calcPace = function(age){
	return 2 - (Math.round((age / 100) * 10) / 10)
}

var genPeople = function(amount){
	var patrons = []
	for(i = 0; i < amount; i++){
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

/*
var spawnGroup = function(patrons, pub, time){
	seat = Math.floor(Math.random() * 10)
	var toBeSeated = []

	if(pub.seats[seat].seated.length == 0){
		var potential = patrons.filter(function (el) {
			  return el.age <= time + 5 && el.age >= time - 5;
			});
		for(var i = 0; i < pub.seats[seat].max; i++){
			toBeSeated = potential.pop()
			console.log("TOBESEATED")
			console.log(toBeSeated)			
		}
		return toBeSeated
	} else {
		return false
	}

*/

var spawnGroup = function(patrons, time){
	var seat = Math.floor(Math.random() * 10)
	var targetAge = (time + 100) - (time * 2)
	if(targetAge < 18){
		targetAge = 18
	}

	if(pub.seats[seat].seated.length == 0){
		console.log("#DUBUG: Actually Spawning Group")
		var potential = patrons.filter(function(o){
			return o.age <= targetAge + 5 && o.age >= targetAge - 5
		})
		for(var i = 0; i < pub.seats[seat].max; i++)
			if(potential[i]){
				console.log("PATRONS LEN" + patrons.length)
				pub.seats[seat].seated.push(potential[i])
				patrons = patrons.filter(function(r){
					return r._id != potential[i]._id
				})
				console.log("NEW PATRONS LEN" + patrons.length)
				console.log(pub.seats[seat].seated)
			}
	}

	return patrons
}

var removeGroup = function(patrons, time){
	var seat = Math.floor(Math.random() * 10)
	if(time < 18){
		time = 18
	}

	if(pub.seats[seat].seated.length = pub.seats[seat].max){
		console.log("SEATED" + pub.seats[seat].seated.length)
		var potential = pub.seats[seat].seated.filter(function(o){
			return o.age < time + 5 && o.age > time - 5
		})

		console.log(potential)
		
		if(potential.length > 0){
			console.log("#DUBUG: Actually Removing Group")
		}
		//pub.seats[seat].seated = []
	}
}



var gen = function(patrons){
	
	for(i = pub.times.openingTime; i < pub.times.closingTime; i = i + (60 * 5)){	
		/*
		SEAT PEOPLE
		*/
		//calcualte the remaining capacity in the pub as a percentage.
		//console.log("CAP" + pub.calcCapacity(pub.seats))
		var usedSpace = Math.floor((pub.calcCapacity(pub.seats) * 100) / pub.calcMaxCapacity(pub.seats))
		console.log("#DUBUG: Percentage of Remaining Capacity @ " + makeTime(i) + ": " + usedSpace + "%") 

		if(Math.floor(Math.random() * 100) > (usedSpace + 25)){
			console.log("#DUBUG: RNG Remove Group Attempt @" + makeTime(i))
			//removeGroup(patrons, time)
		}

		//spawn if RND is more than cap, so higher cap should be more chance of spawning.
		if(Math.floor(Math.random() * 100) > usedSpace){
			console.log("#DUBUG: RNG Spawn Attempt @" + makeTime(i))
			//calculate time remaining as a percentage
			var time = Math.floor(((i - pub.times.openingTime) * 100) / (pub.times.closingTime - pub.times.openingTime))
			patrons = spawnGroup(patrons, time)
		}
		/*
		REMOVE PEOPLE
		*/
		

	}
	console.log("FINAL STATE")
	console.log(pub.seats)

}


var patrons = genPeople(1000)
//console.log(patrons)
console.log(gen(patrons))
