<template>
	<div class="check">
		<div class="tiles">
			<img
				v-for="n in playerHand.length === 18 ? 18 : 17"
				:key="n"
				:src="
					playerHand.length >= n
						? `/images/${playerHand[n - 1].suit}_${
								playerHand[n - 1].value
						  }.png`
						: '/images/麻將背面.png'
				"
				:alt="
					playerHand.length >= n
						? `${playerHand[n - 1].value} of ${
								playerHand[n - 1].suit
						  }`
						: '背面'
				"
				class="tile"
				@click="removeTile(n - 1)"
			/>
		</div>
		<div class="tiles">
			<img
				v-for="card in mahjongTiles"
				:key="card.suit + card.value"
				:src="`/images/${card.suit}_${card.value}.png`"
				:alt="`${card.value} of ${card.suit}`"
				:data-suit="card.suit"
				:data-value="card.value"
				class="tile"
				@click="selectTile(card.suit, card.value)"
			/>
		</div>
		<div class="btns">
			<PrimaryBtn :label="'計算台數'" @click="calculateTai" />
		</div>
	</div>
</template>
<script setup>
class Card {
	constructor(suit, value) {
		this.suit = suit;
		this.value = value;
	}
}
const mahjongTiles = ref([
	{ suit: 'cookie', value: 1 },
	{ suit: 'cookie', value: 2 },
	{ suit: 'cookie', value: 3 },
	{ suit: 'cookie', value: 4 },
	{ suit: 'cookie', value: 5 },
	{ suit: 'cookie', value: 6 },
	{ suit: 'cookie', value: 7 },
	{ suit: 'cookie', value: 8 },
	{ suit: 'cookie', value: 9 },
	{ suit: 'bamboo', value: 1 },
	{ suit: 'bamboo', value: 2 },
	{ suit: 'bamboo', value: 3 },
	{ suit: 'bamboo', value: 4 },
	{ suit: 'bamboo', value: 5 },
	{ suit: 'bamboo', value: 6 },
	{ suit: 'bamboo', value: 7 },
	{ suit: 'bamboo', value: 8 },
	{ suit: 'bamboo', value: 9 },
	{ suit: 'wan', value: 1 },
	{ suit: 'wan', value: 2 },
	{ suit: 'wan', value: 3 },
	{ suit: 'wan', value: 4 },
	{ suit: 'wan', value: 5 },
	{ suit: 'wan', value: 6 },
	{ suit: 'wan', value: 7 },
	{ suit: 'wan', value: 8 },
	{ suit: 'wan', value: 9 },
	{ suit: 'wind', value: '東' },
	{ suit: 'wind', value: '南' },
	{ suit: 'wind', value: '西' },
	{ suit: 'wind', value: '北' },
	{ suit: 'dragon', value: '中' },
	{ suit: 'dragon', value: '發' },
	{ suit: 'dragon', value: '白' },
]);
const playerHand = reactive([]);
const selectTile = (suit, value) => {
	playerHand.push(new Card(suit, value));
};
const removeTile = (index) => {
	if (index >= 0 && index < playerHand.length) {
		playerHand.splice(index, 1);
	}
};
const sortHand = (hand) => {
	return hand.sort((a, b) => {
		if (a.suit === b.suit) {
			return a.value - b.value;
		}
		return a.suit > b.suit ? 1 : -1;
	});
};
// 定義胡牌判斷函數
const canHu = (hand) => {
	// 確保手牌數量為 17 或 18 張，適應含有槓牌的情況
	if (hand.length !== 17 && hand.length !== 18) {
		return false;
	}

	// 對手牌進行排序，便於處理
	const sortedHand = sortHand(hand.map((card) => ({ ...card })));

	// 深度優先搜索（DFS）函數，用於尋找有效的胡牌組合
	function dfs(remainingHand, pairFound = false) {
		// 所有手牌處理完畢，且找到至少一對將牌，表示可以胡牌
		if (remainingHand.length === 0) return pairFound;

		// 嘗試找出將牌，只在還沒找到將牌時執行
		if (!pairFound) {
			for (let i = 0; i < remainingHand.length - 1; i++) {
				// 利用 every 檢查兩張牌是否可以組成將牌（數值和花色相同）
				if (
					[remainingHand[i], remainingHand[i + 1]].every(
						(card, _, arr) =>
							card.value === arr[0].value &&
							card.suit === arr[0].suit
					)
				) {
					const newHand = remainingHand
						.slice(0, i)
						.concat(remainingHand.slice(i + 2));
					if (dfs(newHand, true)) return true; // 如果剩餘牌型也滿足條件，則可以胡牌
				}
			}
		}

		// 在已找到將牌的前提下，嘗試找出碰、順子或槓
		for (let i = 0; i <= remainingHand.length - 3; i++) {
			// 槓牌檢查，需要四張數值和花色都相同的牌
			if (
				i <= remainingHand.length - 4 &&
				remainingHand
					.slice(i, i + 4)
					.every(
						(card, _, arr) =>
							card.value === arr[0].value &&
							card.suit === arr[0].suit
					)
			) {
				const newHand = remainingHand
					.slice(0, i)
					.concat(remainingHand.slice(i + 4));
				if (dfs(newHand, pairFound)) return true;
				continue; // 處理完槓牌後繼續檢查下一組可能
			}
			// 碰檢查，三張數值相同的牌
			if (
				remainingHand[i].value === remainingHand[i + 1].value &&
				remainingHand[i].value === remainingHand[i + 2].value
			) {
				const newHand = remainingHand
					.slice(0, i)
					.concat(remainingHand.slice(i + 3));
				if (dfs(newHand, pairFound)) return true;
			}
			// 順子檢查，三張連續的牌且花色相同
			if (
				i <= remainingHand.length - 3 &&
				remainingHand[i + 1].value === remainingHand[i].value + 1 &&
				remainingHand[i + 2].value === remainingHand[i].value + 2 &&
				remainingHand[i].suit === remainingHand[i + 1].suit &&
				remainingHand[i].suit === remainingHand[i + 2].suit
			) {
				const newHand = remainingHand
					.slice(0, i)
					.concat(remainingHand.slice(i + 3));
				if (dfs(newHand, pairFound)) return true;
			}
		}

		// 如果所有可能都已嘗試過且無法找到有效的胡牌組合，則返回 false
		return false;
	}

	// 從排序後的手牌開始進行深度優先搜索
	return dfs(sortedHand);
};

const calculateTai = () => {
	if (!canHu(playerHand)) {
		alert('無法胡牌');
		return;
	}
	// 對手牌進行排序，便於處理
	const sortedHand = sortHand([...playerHand]);
	let totalTai = 0;
	let result = [];

	const windDragonResult = calculateWindDragonTai(sortedHand);
	totalTai += windDragonResult.tai;
	result.push(windDragonResult.resultStr);

	const uniformSuitTypeResult = calculateUniformSuitType(sortedHand);
	if (uniformSuitTypeResult.tai > 0) {
		totalTai += uniformSuitTypeResult.tai;
		result.push(uniformSuitTypeResult.resultStr);
	} else {
		if (isPonPonHu(sortedHand)) {
			totalTai += 4;
			result.push('碰碰胡 +4台');
		}
		if (isPingHu(sortedHand)) {
			totalTai += 2;
			result.push('平胡 +2台');
		}
	}

	alert(result);
	console.log(totalTai, result);
};
//碰碰胡
const isPonPonHu = (hand) => {
	let pairCount = 0; // 對子數量
	let tripletOrKongCount = 0; // 刻子或槓數量

	for (let i = 0; i < hand.length; ) {
		const currentCardCount = hand.filter(
			(card) => card.value === hand[i].value && card.suit === hand[i].suit
		).length;
		if (currentCardCount === 2) {
			pairCount++;
			i += 2;
		} else if (currentCardCount === 3 || currentCardCount === 4) {
			tripletOrKongCount++;
			i += currentCardCount;
			console.log(tripletOrKongCount);
			console.log(i);
		} else {
			return false;
		}
	}
	return pairCount === 1 && tripletOrKongCount === 5;
};

//平胡
const isPingHu = (hand) => {
	for (let i = 0; i < hand.length - 1; i++) {
		if (
			hand[i].value === hand[i + 1].value &&
			hand[i].suit === hand[i + 1].suit
			//把一對的作為眼
		) {
			let tempHand = [...hand];
			tempHand.splice(i, 2); //移除對子
			if (canFormSequencesOnly(tempHand)) {
				return true; //如果剩下的牌可以組成順子，則可以平胡
			}
		}
	}
	return false;
};
//判斷一副牌是否都由順子組成
const canFormSequencesOnly = (hand) => {
	// 手牌為空，表示可以完全由順子組成
	if (hand.length === 0) return true;

	for (let i = 0; i <= hand.length - 3; i++) {
		if (
			hand[i + 1] &&
			hand[i + 2] &&
			hand[i].suit === hand[i + 1].suit &&
			hand[i].suit === hand[i + 2].suit &&
			hand[i].value + 1 === hand[i + 1].value &&
			hand[i].value + 2 === hand[i + 2].value
		) {
			// 找到一個順子，移除後繼續檢查剩餘的牌
			let tempHand = [...hand];
			tempHand.splice(i, 3); // 移除順子
			if (canFormSequencesOnly(tempHand)) {
				return true; // 如果剩下的牌可以完全由順子組成，則返回 true
			}
		}
	}

	return false; // 所有可能都已嘗試過且無法找到有效的組合，則返回 false
};

const calculateWindDragonTai = (hand) => {
	const specialCards = hand.filter(
		(card) => card.suit === 'wind' || card.suit === 'dragon'
	);
	let setsCount = { 東: 0, 南: 0, 西: 0, 北: 0, 中: 0, 發: 0, 白: 0 };
	//計算刻子和對子的數量
	specialCards.forEach((card) => {
		setsCount[card.value] += 1;
	});
	return calculateTaiFromWindDragon(setsCount);
};
const calculateTaiFromWindDragon = (setsCount) => {
	let tai = 0;
	let resultStr = '';

	const windSets = ['東', '南', '西', '北'];
	const dragonSets = ['中', '發', '白'];

	//分別計算風牌和箭牌的刻子和對子的數量
	const windKeziCount = windSets.filter(
		(wind) => setsCount[wind] === 3
	).length;
	const windDuiCount = windSets.filter(
		(wind) => setsCount[wind] === 2
	).length;
	const dragonKeziCount = dragonSets.filter(
		(dragon) => setsCount[dragon] === 3
	).length;
	const dragonDuiCount = dragonSets.filter(
		(dragon) => setsCount[dragon] === 2
	).length;

	// 判斷大四喜、小四喜
	if (windKeziCount === 4) {
		tai += 16;
		resultStr += '大四喜 +16台';
	} else if (windKeziCount === 3 && windDuiCount === 1) {
		tai += 8;
		resultStr += '小四喜 +8台';
	}

	// 判斷大三元、小三元
	if (dragonKeziCount === 3) {
		tai += 8;
		resultStr += '大三元 +8台';
	} else if (dragonKeziCount === 2 && dragonDuiCount === 1) {
		tai += 4;
		resultStr += '小三元 +4台';
	} else if (dragonKeziCount === 1) {
		tai += 1;
		resultStr += '三元牌 +1台';
	}

	return { tai, resultStr };
};
//判斷清一色、字一色、混一色
const calculateUniformSuitType = (hand) => {
	let tai = 0;
	let resultStr = '';
	const allZiPai = hand.every(
		(card) => card.suit === 'wind' || card.suit === 'dragon'
	);

	const firstCardSuit = hand[0].suit;
	const allSameSuit = hand.every((card) => card.suit === firstCardSuit);

	const hasZiPai = hand.some(
		(card) => card.suit === 'wind' || card.suit === 'dragon'
	);
	const nonZiPai = hand.filter(
		(card) => card.suit !== 'wind' && card.suit !== 'dragon'
	);
	const nonZiPaiFirstSuit = nonZiPai.length > 0 ? nonZiPai[0].suit : '';
	const allNonZiPaiSameSuit = nonZiPai.every(
		(card) => card.suit === nonZiPaiFirstSuit
	);

	if (allZiPai) {
		tai += 8;
		resultStr += '字一色 +8台';
	} else if (allSameSuit) {
		tai += 6;
		resultStr += '清一色 +6台';
	} else if (hasZiPai && allNonZiPaiSameSuit) {
		tai += 4;
		resultStr += '混一色 +4台';
	}

	return { tai, resultStr };
};
</script>
<style scoped lang="scss">
.check {
	width: 50%;
	margin: auto;

	@include m() {
		width: 100%;
	}

	.tiles {
		display: flex;
		flex-wrap: wrap;
		height: auto;
		padding: 30px;

		.tile {
			cursor: pointer;
			width: 11%;
		}
	}
	.btns {
		display: flex;
		justify-content: center;
	}
}
</style>
