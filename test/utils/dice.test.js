
import { d6 } from '../../utils/dice';

test('return random integer between 1 and 6', () => {

	let r = [];
	let i = 0;
	for(i = 0; i < 1000; i++){
		r.push(d6());
	}
	expect(r.every(i => [1,2,3,4,5,6].includes(i)));
});



