import bronze from '../assets/images/ranks/bronze.svg';
import silver from '../assets/images/ranks/silver.svg';
import gold from '../assets/images/ranks/gold.svg';
import plat from '../assets/images/ranks/plat.svg';
import dia from '../assets/images/ranks/dia.svg';

export enum RANK {
	BRONZE,
	SILVER,
	GOLD,
	PLAT,
	DIAMOND
}

export function rankImageMap(rank: RANK) {
	switch (rank) {
		case RANK.BRONZE:
			return bronze;
		case RANK.SILVER:
			return silver;
		case RANK.GOLD:
			return gold;
		case RANK.PLAT:
			return plat;
		case RANK.DIAMOND:
			return dia;
		default:
			return bronze; // Default to bronze if rank is unknown
	}
}

export function calculateRank(MMR: number) {
	if (MMR < 500) {
		return RANK.BRONZE;
	} else if (MMR < 1500) {
		return RANK.SILVER;
	} else if (MMR < 2500) {
		return RANK.GOLD;
	} else if (MMR < 4000) {
		return RANK.PLAT;
	} else {
		return RANK.DIAMOND;
	}
}
