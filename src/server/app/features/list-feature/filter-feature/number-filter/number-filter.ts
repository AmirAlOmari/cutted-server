import { CompilableFeature } from "./../../compilable-feature";

export interface INumberFilter {
	by: string;
	min?: number;
	max?: number;
}

export class NumberFilter implements INumberFilter, CompilableFeature {
	public by: string;
	public min?: number;
	public max?: number;

	constructor({ by, min, max }: INumberFilter) {
		this.by = by;
		this.min = min;
		this.max = max;
	}

	public compile() {
		const o: any = {};
		if (typeof this.min === "number") {
			o.$gte = this.min;
		}

		if (typeof this.max === "number") {
			o.$lte = this.max;
		}

		if (Object.getOwnPropertyNames(o).length) {
			return o;
		}
	}
}
