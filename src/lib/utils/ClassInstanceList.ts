class ClassInstanceList {
	public static all: ClassInstanceList[] = [];

	constructor() {
		ClassInstanceList.all = [...ClassInstanceList.all, this];
	}

	public destroy() {
		ClassInstanceList.all = ClassInstanceList.all.filter((i) => i !== this);
	}
}

export default ClassInstanceList;