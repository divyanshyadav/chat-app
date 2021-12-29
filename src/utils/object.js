export function deepMerge(obj1, obj2) {
	if (typeof obj1 !== "object") {
		return obj2;
	}

	if (Array.isArray(obj1)) {
		let array = [];
		let i = 0;
		let j = 0;

		while (i < obj1.length && j < obj2.length) {
			array.push(deepMerge(obj1[i++], obj2[j++]));
		}

		while (i < obj1.length) {
			array.push(obj1[i++]);
		}

		while (j < obj2.length) {
			array.push(obj2[j++]);
		}

		return array;
	}

	const newObj = { ...obj1 };
	Object.keys(obj2).forEach((key) => {
		if (obj1[key] === undefined) {
			newObj[key] = obj2[key];
		} else {
			newObj[key] = deepMerge(obj1[key], obj2[key]);
		}
	});

	return newObj;
}
