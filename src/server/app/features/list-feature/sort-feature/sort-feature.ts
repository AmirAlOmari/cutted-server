import { CompilableFeature } from "../compilable-feature";

export type SortOrder = "ASC" | "DESC";

export interface ISortFeature {
	/** by which field/column */
	by: string;
	/** order direction */
	order: SortOrder;
}

export type ICompiledSortOrder = 1 | -1;

export interface ICompiledSortExpression {
	[key: string]: SortOrder;
}

export class SortFeature implements ISortFeature, CompilableFeature {
	public by: string;
	public order: SortOrder;

	constructor(o: ISortFeature) {
		this.by = o.by;
		this.order = o.order;
	}

	public compile(): ICompiledSortExpression {
		const result: ICompiledSortExpression = {
			[this.by]: this.order,
		};

		return result;
	}
}
