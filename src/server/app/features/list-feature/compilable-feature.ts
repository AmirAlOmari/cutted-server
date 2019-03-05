export abstract class CompilableFeature {
	public compile(...args: Array<any>): any {
		throw new Error("Method was not overrided!");
	}
}
