import { CompilableFeature } from "./../../compilable-feature";

export interface IStringFilter {
	by: string;
	value: string;
}

export class StringFilter implements IStringFilter, CompilableFeature {
	public by: string;
	public value: string;

	constructor({ by, value }: IStringFilter) {
		this.by = by;
		this.value = value;
	}

	public compile() {
		const str: string = this.value.trim().replace(/\W+/g, " ");
		const words: Array<string> = str.split(" ").filter((e) => e);
		const groups: string = words.join("|");
		const regExp: RegExp = new RegExp(groups, "gi");

		return regExp;
	}
}
