import { readFile, writeFile } from 'fs/promises';
import handler from '../../../../pages/api/alfred/setpool';

jest.mock('fs/promises');

const DATA_FILE_NAME = "./data/chtulhu_chars.json";


// setpool skill,max -> set skill pool to max for user
// setpool skill,-2 -> remove 2 skill points for user, except if not enough
// setpool skill,+2 -> add 2 skill points for user, capped to max
// setpool skill,=2 -> set pool to 2 except if 2 > max for user
// setpool skill,max,player -> set skill pool to max for player
// setpool skill,-2,player -> remove 2 skill points for player, except if not enough
// setpool skill,+2,player -> add 2 skill points for player, capped to max
// setpool skill,=2,player -> set pool to 2 except if 2 > max for player

describe('Setpool API', () => {

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

	describe('when providing no player', () => {

		beforeEach(() => {
			json = jest.fn();
			res =  {
				status: jest.fn()
					.mockImplementation(() => ({
						json: json,
					})),
			};	
		});

		describe('using "max"', () => {

			test('set pool to max.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 1, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy, max"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 4/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "robert", bureaucracy: {pool: 4, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});

		describe('using "+"', () => {

			test('adds points to pool.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 1, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy, +2"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 3/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "robert", bureaucracy: {pool: 3, skill: 4}}], null, 4), {encoding: "utf-8"});
			});

			test('caps to max.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 1, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,+4"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 4/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "robert", bureaucracy: {pool: 4, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});

		describe('using "-"', () => {

			test('remove points from pool.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,-2"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 1/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "robert", bureaucracy: {pool: 1, skill: 4}}], null, 4), {encoding: "utf-8"});
			});

			test('refuses when not enough points.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,-4"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Erreur: Bureaucracy ne peut pas etre négatif...'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).not.toHaveBeenCalled();
			});

			test('accepts when not enough points if skill is stability.', async () => {
				data = [{name: "robert", stability: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "stability,-5"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Stability mis à -2/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "robert", stability: {pool: -2, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});


		describe('using "="', () => {

			test('set pool to value.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,=2"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 2/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "robert", bureaucracy: {pool: 2, skill: 4}}], null, 4), {encoding: "utf-8"});
			});

			test('refuses when exceeding max.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,=6"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Erreur: le maximum pour Bureaucracy est 4...'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).not.toHaveBeenCalled();
			});

			test('refuses setting to negative.', async () => {
				data = [{name: "robert", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,=-1"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Erreur: Bureaucracy ne peut pas etre négatif...'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).not.toHaveBeenCalled();
			});

			test('accepts setting to negative if skill is stability.', async () => {
				data = [{name: "robert", stability: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "stability,=-5"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Stability mis à -5/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "robert", stability: {pool: -5, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});
	});

	describe('when providing player', () => {

		beforeEach(() => {

		});

		describe('using "max"', () => {

			test('set pool to max.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 1, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy, max, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 4/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "adele", bureaucracy: {pool: 4, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});

		describe('using "+"', () => {

			test('adds points to pool.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 1, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy, +2, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 3/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "adele", bureaucracy: {pool: 3, skill: 4}}], null, 4), {encoding: "utf-8"});
			});

			test('caps to max.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 1, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,+4, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 4/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "adele", bureaucracy: {pool: 4, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});

		describe('using "-"', () => {

			test('remove points from pool.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,-2, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 1/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "adele", bureaucracy: {pool: 1, skill: 4}}], null, 4), {encoding: "utf-8"});
			});

			test('refuses when not enough points.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,-4, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Erreur: Bureaucracy ne peut pas etre négatif...'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).not.toHaveBeenCalled();
			});

			test('accepts when not enough points if skill is stability.', async () => {
				data = [{name: "adele", stability: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "stability,-5, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Stability mis à -2/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "adele", stability: {pool: -2, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});


		describe('using "="', () => {

			test('set pool to value.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,=2, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Bureaucracy mis à 2/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "adele", bureaucracy: {pool: 2, skill: 4}}], null, 4), {encoding: "utf-8"});
			});

			test('refuses when exceeding max.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,=6, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Erreur: le maximum pour Bureaucracy est 4...'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).not.toHaveBeenCalled();
			});

			test('refuses setting to negative.', async () => {
				data = [{name: "adele", bureaucracy: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "bureaucracy,=-1, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Erreur: Bureaucracy ne peut pas etre négatif...'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).not.toHaveBeenCalled();
			});

			test('accepts setting to negative if skill is stability.', async () => {
				data = [{name: "adele", stability: {pool: 3, skill: 4}}];
				readFile.mockImplementation(() => JSON.stringify(data));
				req =  {query: {user_name: "robert", text: "stability,=-5, adele"} };

				await handler(req, res);

			  	expect(res.status).toHaveBeenCalledWith(200);
			  	expect(json).toHaveBeenCalledWith({
			        response_type: "in_channel",
			        text: 'Stability mis à -5/4'
			    });

				expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
				expect(writeFile).toHaveBeenCalledWith(DATA_FILE_NAME,
					JSON.stringify([{name: "adele", stability: {pool: -5, skill: 4}}], null, 4), {encoding: "utf-8"});
			});
		});
	});

	describe('when given a bad character name', () => {

		test('gives an error.', async () => {
			data = [{name: "adele", bureaucracy: {pool: 3, skill: 4}}];
			readFile.mockImplementation(() => JSON.stringify(data));
			req =  {query: {user_name: "robert", text: "bureaucracy,=-1, jeanine"} };

			await handler(req, res);

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
          		response_type: "in_channel",
          		text: 'Erreur: personnage " jeanine" introuvable... thoughts?'
		    });

			expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
			expect(writeFile).not.toHaveBeenCalled();
		});
	});

	describe('when given a bad skill name', () => {

		test('gives an error.', async () => {
			data = [{name: "adele", bureaucracy: {pool: 3, skill: 4}}];
			readFile.mockImplementation(() => JSON.stringify(data));
			req =  {query: {user_name: "robert", text: "baracratie,=-1, adele"} };

			await handler(req, res);

		  	expect(res.status).toHaveBeenCalledWith(200);
		  	expect(json).toHaveBeenCalledWith({
          		response_type: "in_channel",
          		text: 'Erreur: skill "baracratie" introuvable... thoughts?'
		    });

			expect(readFile).toHaveBeenCalledWith(DATA_FILE_NAME, {encoding: "utf-8"});
			expect(writeFile).not.toHaveBeenCalled();
		});
	});
});


