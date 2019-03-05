import { CompilableFeature } from "../compilable-feature";

export interface IPaginateFeature {
	/** count objects per page */
	countOnPage: number;
	/** current observing page */
	page: number;
}

export interface ICompiledPaginateExpression extends IPaginateFeature {
	wholeCount: number;
	pages: number;
}

export class PaginateFeature implements CompilableFeature {
	public countOnPage: number;
	public page: number;
	public skip: number;
	public wholeCount?: number;
	public pages?: number;

	constructor(o: IPaginateFeature) {
		this.countOnPage = o.countOnPage;
		this.page = o.page;
		this.skip = this.countOnPage * this.page;
	}

	public compile(wholeCount: number): ICompiledPaginateExpression {
		this.wholeCount = wholeCount;
		this.pages = this.countOnPage ? Math.ceil(this.wholeCount / this.countOnPage) : 1;

		return {
			countOnPage: this.countOnPage,
			page: this.page,
			wholeCount: this.wholeCount,
			pages: this.pages,
		};
	}
}
