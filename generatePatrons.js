const basePeople = require('./basePeople.js')

var patrons = []
for(i = 0; i < 100; i++){
	var age = Math.floor(Math.random() * (97 - 18) ) + 18;
	var pace = Math.round((Math.random() + 1) * 10) / 10;
	var person = {
					'_id': i.toString(),
					'name': basePeople[i].name,
					'gender': basePeople[i].gender,
					'beverage': basePeople[i].beverage,
					'x': 10,
					'y': 200,
					'state':{
						'age': age, 
						'drinkLevel': 0, 
						'pace': pace
					}
				};
	patrons.push(person)
}

console.log(patrons)