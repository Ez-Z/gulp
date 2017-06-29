import consoleA from './bbb.js';
import alertC from './ccc.js';

export default class Person {
	construct(_name = 'nonames', _age = '01' ){
		this.name = _name;
		this.age = _age;
	}
	getName() {
		return this.name;
	}
	getAge() {
		return this.age;
	}
	grow(year = 1) {
		this.age += year;
	}
}