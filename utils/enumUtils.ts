const convertEnumToObj = (enumObj: any) => {
	return Object.keys(enumObj).map((key) => {
		return {
			id: key,
			name:
				enumObj[key].charAt(0).toUpperCase() +
				enumObj[key].slice(1).toLowerCase(),
		}
	})
}

export { convertEnumToObj }
