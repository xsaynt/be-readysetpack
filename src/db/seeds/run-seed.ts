import usersData from '../data/development-data/users';
import tripsData from '../data/development-data/trips';
import checklistData from '../data/development-data/checklist';
import costsData from '../data/development-data/dailycost';
import seed from './seed';
import db from '../connection';

const runSeed = () => {
	return seed({ usersData, tripsData, checklistData, costsData }).then(() =>
		db.end()
	);
};

runSeed();
