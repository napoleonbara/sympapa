import { readFile, writeFile } from 'fs/promises';
import handler from '../../../../pages/api/alfred/roll';
import { d6 } from '../../../../utils/dice';

jest.mock('fs/promises');
jest.mock('../../../../utils/dice');

const DATA_FILE_NAME = "./data/chtulhu_chars.json";

describe('Roll API', () => {

	let req;
	let json;
	let res;
	let data;

	afterEach(() => {
		readFile.mockClear();
		writeFile.mockClear();
		res.status.mockClear();
		json.mockClear();			
	});		

	describe('when no points given', () => {

		beforeEach(() => {
			readFile.mockImplementation(() => {});
			writeFile.mockImplementation(() => {});
			req =  {query: {user_name: "robert", text: "scuffling"} };
			json = jest.fn();
			res =  {
				status: jest.fn()
					.mockImplementation(() => ({
						json: json,
					})),
			};			
		});

		test('just roll a dice.', async () => {

			d6.mockImplementation(() => 4);

			await handler(req, res);

			expect(writeFile).not.toHaveBeenCalled();
			expect(readFile).not.toHaveBeenCalled();

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
		        response_type: "in_channel",
		        text: 'Rolled Scuffling: 4 + 0 -> 4'
		    });
		});

	});

	describe('when points given', () => {

		beforeEach(() => {
			data = [{name: "robert", scuffling: {pool: 4, skill: 4}}];
			readFile.mockImplementation(() => JSON.stringify(data));
			writeFile.mockImplementation(() => {});
			req =  {query: {user_name: "robert", text: "scuffling,2"} };
			json = jest.fn();
			res =  {
				status: jest.fn()
					.mockImplementation(() => ({
						json: json,
					})),
			};			
		});

		test('refuses negative points.', async () => {

			req =  {query: {user_name: "robert", text: "scuffling,-2"} };

			await handler(req, res);

			expect(readFile).not.toHaveBeenCalledWith();
			expect(writeFile).not.toHaveBeenCalledWith();

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
		        response_type: "in_channel",
		        text: 'Erreur: on ne peut pas mettre un nombre négatif de points...'
		    });
		});

		test('adds points to the roll and substract from the db.', async () => {
	
			d6.mockImplementation(() => 2);
			req =  {query: {user_name: "robert", text: "scuffling,3"} };

			await handler(req, res);

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
		        response_type: "in_channel",
		        text: 'Rolled Scuffling: 2 + 3 -> 5'
		    });

			expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
			expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
				JSON.stringify([{name: "robert", scuffling: {pool: 1, skill: 4}}], null, 4), {encoding: "utf-8"});
		});

		test('refuses when not enough points.', async () => {
	
			req =  {query: {user_name: "robert", text: "scuffling,5"} };

			await handler(req, res);

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
          		response_type: "in_channel",
          		text: `Erreur: pas assez de points... thoughts?`
		    });

			expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
			expect(writeFile).not.toHaveBeenCalled();
		});

		test('accepts going to negative when skill is "stability".', async () => {
	
			d6.mockImplementation(() => 2);
			data = [{name: "robert", stability: {pool: 4, skill: 4}}];
			readFile.mockImplementation(() => JSON.stringify(data));
			req =  {query: {user_name: "robert", text: "stability,5"} };

			await handler(req, res);

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
		        response_type: "in_channel",
		        text: 'Rolled Stability: 2 + 5 -> 7'
		    });

			expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
			expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
				JSON.stringify([{name: "robert", stability: {pool: -1, skill: 4}}], null, 4), {encoding: "utf-8"});
		});

		test('only accepts general skills', async () => {
	
			d6.mockImplementation(() => 2);
			data = [{name: "robert", scuffling: {pool: 4, skill: 4}}];
			readFile.mockImplementation(() => JSON.stringify(data));
			req =  {query: {user_name: "robert", text: "history,2"} };

			await handler(req, res);

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
          		response_type: "in_channel",
          		text: `Erreur: on ne peut jeter les dés que sur les skills générales...`
		    });

			expect(readFile).not.toHaveBeenCalled();
			expect(writeFile).not.toHaveBeenCalled();
		});		
	});

	describe('when given a bad character name', () => {

		beforeEach(() => {
			data = [{name: "robert", scuffling: {pool: 4, skill: 4}}];
			readFile.mockImplementation(() => JSON.stringify(data));
			writeFile.mockImplementation(() => {});
			req =  {query: {user_name: "jean_jaques", text: "scuffling, 3"} };
			json = jest.fn();
			res =  {
				status: jest.fn()
					.mockImplementation(() => ({
						json: json,
					})),
			};			
		});

		test('gives an error.', async () => {

			await handler(req, res);

			expect(writeFile).not.toHaveBeenCalled();
			expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
          		response_type: "in_channel",
          		text: 'Erreur: personnage "jean jaques" introuvable... thoughts?'
		    });
		});
	});

	describe('when specified a character name', () => {

		beforeEach(() => {
			data = [{name: "robert", piloting: {pool: 3, skill: 4}}];
			readFile.mockImplementation(() => JSON.stringify(data));
			writeFile.mockImplementation(() => {});
			req =  {query: {user_name: "jean_jaques", text: "piloting, 3, robert"} };
			json = jest.fn();
			res =  {
				status: jest.fn()
					.mockImplementation(() => ({
						json: json,
					})),
			};			
		});

		test('overrides the user name.', async () => {

			d6.mockImplementation(() => 2);
			req =  {query: {user_name: "robert", text: "piloting,3"} };

			await handler(req, res);

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
		        response_type: "in_channel",
		        text: 'Rolled Piloting: 2 + 3 -> 5'
		    });

			expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
			expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
				JSON.stringify([{name: "robert", piloting: {pool: 0, skill: 4}}], null, 4), {encoding: "utf-8"});
		});
	});	
});

