export function insertionSort(array, cmp) {
	for (let i = 1; i < array.length; i++) {
		const current = array[i];
		let j = i - 1;

		while (j >= 0 && cmp(array[j], current) > 0) {
			array[j + 1] = array[j];
			j--;
		}

		array[j + 1] = current;
	}

	return array;
}
