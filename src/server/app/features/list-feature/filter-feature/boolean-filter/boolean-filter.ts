import { CompilableFeature } from "./../../compilable-feature";

export interface IBooleanFilter {
	by: string;
	value: boolean;
}

export class BooleanFilter implements IBooleanFilter, CompilableFeature {
	public by: string;
	public value: boolean;

	constructor({ by, value }: IBooleanFilter) {
		this.by = by;
		this.value = value;
	}

	public compile() {
		return this.value;
	}
}
