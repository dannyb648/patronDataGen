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
							'leaving': false
						}
					};
		patrons.push(person)
	}
	return patrons;
};

var x = genPeople(10)

console.log(x)