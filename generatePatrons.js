const basePeople = require('./basePeople.js')
const fs = require('fs')
const path = require('path')


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
		var age = Math.floor(Math.random() * (80 - 18) ) + 18;
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
							'atBar': false,
						}
					};
		patrons.push(person)
	}
	return patrons;
};
 
var assignCoords = function(){
	for(var table = 0; table < pub.seats.length; table++){
		if(pub.seats[table].seated.length > 0){
			for(var seat = 0; seat < pub.seats[table].seated.length; seat++){
				if(pub.seats[table].id != 'standing2'){
					pub.seats[table].seated[seat].x = pub.seats[table].coords[seat].x
					pub.seats[table].seated[seat].y = pub.seats[table].coords[seat].y
				} else if(pub.seats[table].id == 'standing2'){
					 
					var randx = Math.floor(Math.random() * (pub.seats[table].coords.maxX - pub.seats[table].coords.minX + 1)) + pub.seats[table].coords.minX;
					pub.seats[table].seated[seat].x = randx
					pub.seats[table].seated[seat].y = pub.seats[table].coords.y
				}
				//console.log("Table: " + pub.seats[table].id + " Seat: " + seat + " Drink Level: " + pub.seats[table].seated[seat].state.drinkLevel)
			}
		}
	}
}

var pub = {
	'takings': 0,
	'staff': 1,
	'times' : {
		'openingTime': 1520676000, 
		'closingTime': 1520730000,
		'timePeriod': 1520730000 - 1520676000,
		'interval': (60 * 5)
		},
	'seats' : [
		{'id': 'table1', 'seated': [], 'max': 4, 'allPresent': true, 'coords': [{'x': 360,'y': 170}, {'x': 425,'y': 235}, {'x': 350,'y': 300}, {'x': 285,'y': 235}]},
		{'id': 'table2', 'seated': [], 'max': 4, 'allPresent': true, 'coords': [{'x': 645,'y': 170}, {'x': 700,'y': 235}, {'x': 645,'y': 300}, {'x': 575,'y': 235}]},
		{'id': 'table3', 'seated': [], 'max': 4, 'allPresent': true, 'coords': [{'x': 500,'y': 300}, {'x': 565,'y': 370}, {'x': 500,'y': 435}, {'x': 430,'y': 370}]},
		{'id': 'table4', 'seated': [], 'max': 4, 'allPresent': true, 'coords': [{'x': 360,'y': 440}, {'x': 425,'y': 500}, {'x': 350,'y': 570}, {'x': 285,'y': 500}]},
		{'id': 'table5', 'seated': [], 'max': 4, 'allPresent': true, 'coords': [{'x': 645,'y': 440}, {'x': 700,'y': 500}, {'x': 645,'y': 570}, {'x': 575,'y': 500}]},
		{'id': 'booth1', 'seated': [], 'max': 8, 'allPresent': true, 'coords': [{'x': 30,'y': 170}, {'x': 55,'y': 170}, {'x': 80,'y': 170}, {'x': 105,'y': 170}, {'x': 30,'y': 285}, {'x': 55,'y': 285}, {'x': 80,'y': 285}, {'x': 105,'y': 285}]},
		{'id': 'booth2', 'seated': [], 'max': 8, 'allPresent': true, 'coords': [{'x': 30,'y': 320}, {'x': 55,'y': 320}, {'x': 80,'y': 320}, {'x': 105,'y': 320}, {'x': 30,'y': 440}, {'x': 55,'y': 440}, {'x': 80,'y': 440}, {'x': 105,'y': 440}]},
		{'id': 'booth3', 'seated': [], 'max': 8, 'allPresent': true, 'coords': [{'x': 30,'y': 475}, {'x': 55,'y': 475}, {'x': 80,'y': 475}, {'x': 105,'y': 475}, {'x': 30,'y': 585}, {'x': 55,'y': 585}, {'x': 80,'y': 585}, {'x': 105,'y': 585}]},
		{'id': 'standing1', 'seated': [], 'max': 8, 'allPresent': true, 'coords': [{'x': 290,'y': 35}, {'x': 335,'y': 75}, {'x': 290,'y': 105}, {'x': 245,'y': 75}, {'x': 400,'y': 35}, {'x': 370,'y': 75}, {'x': 400,'y': 105}, {'x': 435,'y': 75}]},
		{'id': 'standing2', 'seated': [], 'max': 8, 'allPresent': true, 'coords': {'minX': 530, 'maxX': 975, 'y': 30}}
	], 
	'bar': [],
	'weatherRand': Math.floor((Math.random() * 100) + 0), 
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
	var targetAge = (time + 80) - (time * 2)
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

var removeGroup = function(patrons, time){
	//pick seat to vacate
	var seat = Math.floor((Math.random() * pub.seats.length) + 0)
	if(!pub.seats[seat].allPresent){
		console.log(" - - Buying Drinks Table:" + seat + " Wont Leave")
		return
	}

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

var calcTemp = function(time, capacity){
	var c = capacity / 8 
	var t = time / 8
	var r = Math.random()
	return ((t + c) / 2) + (16 + r)
}

var calcWeather = function(){
	r = pub.weatherRand
	seed = [-5,-4,-3,-2,-1,0,1,2,3,4,5]
	pub.weatherRand = r + seed[Math.floor((Math.random() * 10) + (0))]

	var weather;
	if(pub.weatherRand <= 0){
		weather = "Snow and Ice"
	} else if (pub.weatherRand > 0 && pub.weatherRand <=  20){
		weather = "Torrential Rain and Thunder"
	} else if (pub.weatherRand > 21 && pub.weatherRand <= 40){
		weather = "Raining"
	} else if (pub.weatherRand > 41 && pub.weatherRand <= 60){
		weather = "Grey Skies"
	} else if (pub.weatherRand > 61 && pub.weatherRand <= 80){
		weather = "Sunny"
	} else if (pub.weatherRand > 81){
		weather = "Heatwave"
	}
	return weather
}

var calcEvents = function(i, usedSpace, factors){
	var seedSpawn = Math.floor((Math.random() * 100) + 0)
	var seedLeave = Math.floor((Math.random() * 100) + 0)
	var hour = new Date(i * 1000).getHours();
	var spawn = 25
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

/*
'seats' : [
		{'id': 'table1', 'seated': [], 'max': 4, 'allPresent': true},
		{'id': 'table2', 'seated': [], 'max': 4, 'allPresent': true},
		{'id': 'table3', 'seated': [], 'max': 4, 'allPresent': true},
		{'id': 'table4', 'seated': [], 'max': 4, 'allPresent': true},
		{'id': 'table5', 'seated': [], 'max': 4, 'allPresent': true},
		{'id': 'booth1', 'seated': [], 'max': 8, 'allPresent': true},
		{'id': 'booth2', 'seated': [], 'max': 8, 'allPresent': true},
		{'id': 'booth3', 'seated': [], 'max': 8, 'allPresent': true},
		{'id': 'standing1', 'seated': [], 'max': 8, 'allPresent': true},
		{'id': 'standing2', 'seated': [], 'max': 8, 'allPresent': true}
	], 
	'bar': [],
*/

var file = ''

var writeToFile = function(timestamp, cap, time){
	objectToWrite = {
		'timestamp': timestamp,
		'takings': pub.takings,
		'tables': {
			'table1': {'patrons': pub.seats[0].seated, 'allPresent': pub.seats[0].allPresent},
			'table2': {'patrons': pub.seats[1].seated, 'allPresent': pub.seats[1].allPresent},
			'table3': {'patrons': pub.seats[2].seated, 'allPresent': pub.seats[2].allPresent},
			'table4': {'patrons': pub.seats[3].seated, 'allPresent': pub.seats[3].allPresent},
			'table5': {'patrons': pub.seats[4].seated, 'allPresent': pub.seats[4].allPresent},
			'booth1': {'patrons': pub.seats[5].seated, 'allPresent': pub.seats[5].allPresent},
			'booth2': {'patrons': pub.seats[6].seated, 'allPresent': pub.seats[6].allPresent},
			'booth3': {'patrons': pub.seats[7].seated, 'allPresent': pub.seats[7].allPresent},
			'standing1': {'patrons': pub.seats[8].seated, 'allPresent': pub.seats[8].allPresent},
			'standing2': {'patrons': pub.seats[9].seated, 'allPresent': pub.seats[9].allPresent}
		},
		'bar': pub.bar,
		'temp': calcTemp(time, cap),
		'weather': calcWeather(),
		'capacity': cap
	}

	file = file + "\n" + JSON.stringify(objectToWrite, null, 4)
}



var getPrice = function(drink){
	if(drink == 'Vodka'){
		return 2.94
	} else if(drink == 'Cola'){
		return 1.20
	} else if(drink == 'Beer'){
		return 3.00
	} else if(drink == 'Lager'){
		return 2.85
	} else if(drink == 'Whiskey'){
		return 3.43
	} else if(drink == 'Ale'){
		return 2.45
	} else if(drink == 'Cider'){
		return 2.56
	} else {
		return 0
	}
}

var calcTotalPrice = function(table){
	var total = 0;
	for(var seat = 0; seat < pub.seats[table].max; seat++){
		total = total + getPrice(pub.seats[table].seated[seat].beverage)
	}
	return total
}

var goToBar = function(buyer){
	pub.bar.push(buyer)
	console.log(" - Current Bar:" + pub.bar)
	pub.seats[buyer.table].allPresent = false
	pub.seats[buyer.table].seated[buyer.buyerSeat].state.atBar = true
}

var processBar = function(){
	if(pub.bar.length > 0){
		console.log(' - Serving Customer')
		var serving = pub.bar.shift();
		pub.takings = pub.takings + calcTotalPrice(serving.table)
		returnFromBar(serving)
	}
}

var returnFromBar = function(serving){
	pub.seats[serving.table].allPresent = true
	for(var seat = 0; seat < pub.seats[serving.table].max; seat++){
		pub.seats[serving.table].seated[seat].state.drinkLevel = 20
	}
	pub.seats[serving.table].seated[serving.buyerSeat].state.atBar = false

}


var depleteDrink = function(){
	for(var table = 0; table < pub.seats.length; table++){
		if(pub.seats[table].seated.length > 0){
			for(var seat = 0; seat < pub.seats[table].seated.length; seat++){
				pub.seats[table].seated[seat].state.drinkLevel = pub.seats[table].seated[seat].state.drinkLevel - pub.seats[table].seated[seat].state.pace
				if(pub.seats[table].seated[seat].state.drinkLevel < 0){
					pub.seats[table].seated[seat].state.drinkLevel = 0
				}
				//console.log("Table: " + pub.seats[table].id + " Seat: " + seat + " Drink Level: " + pub.seats[table].seated[seat].state.drinkLevel)
			}
		}
	}
}

var gen = function(patrons){
	
	for(var i = pub.times.openingTime; i < pub.times.closingTime ; i = i + (60 * 5)){	

		//calcualte the remaining capacity in the pub as a percentage.
		var usedSpace = Math.floor((pub.calcCapacity(pub.seats) * 100) / pub.calcMaxCapacity(pub.seats))
		var time = Math.floor(((i - pub.times.openingTime) * 100) / (pub.times.closingTime - pub.times.openingTime))

		console.log("#" + makeTime(i) + ": Percentage of Used Space: " + usedSpace + "%") 
		

		var events = calcEvents(i, usedSpace, {})

		if(events.leave){
			console.log(" - Remove Group Attempt")
			removeGroup(patrons, time)
		}
		
		//Check it isnt after bar has closed
		if(i < (pub.times.closingTime - (60 * 60))){
			//for each table
			for(var table = 0; table < pub.seats.length; table++){
				//check if anyone is at table
				if(pub.seats[table].seated.length > 0){
					var needDrink = true;
					//for each person
					for(var seat = 0; seat < pub.seats[table].seated.length; seat++){
						//check if anyone has any drink left
						if(pub.seats[table].seated[seat].state.drinkLevel != 0){
							needDrink = false
						}
					}
					//if someone has finished their drink, and no one has gone to the bar yet...
					if(needDrink && pub.seats[table].allPresent){
						//console.log(" - needDrink : " + needDrink + " allPresent : " + pub.seats[table].allPresent)
						var buyerSeat = Math.floor((Math.random() * (pub.seats[table].seated.length - 1)) + 0)
						goToBar({'table': table, 'buyerSeat': buyerSeat})
					}
				} 
			}
		}

		depleteDrink()

		for(var staff = 0; staff < pub.staff; staff++){
			processBar()
		}



		console.log(" - Bar length: " + pub.bar.length)
		console.log(" - Takings so far : £" + Math.floor(pub.takings))


		if (events.spawn){
			console.log(" - Add Group Attempt")
			patrons = spawnGroup(patrons, time)
		}

		assignCoords()

		writeToFile(i, usedSpace, time)

	}
}



var patrons = genPeople(1000)
//console.log(patrons)
gen(patrons)


///*
fs.writeFileSync("./test.txt", file, 'utf8', function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
//*/

