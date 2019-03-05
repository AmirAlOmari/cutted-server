import { CompilableFeature } from "./compilable-feature";
import { FilterFeature, IFilterFeature } from "./filter-feature/filter-feature";
import { IPaginateFeature, PaginateFeature } from "./pagination-feature/pagination-feature";
import { ICompiledSortExpression, ISortFeature, SortFeature } from "./sort-feature/sort-feature";

export interface IListFeature {
	sort: ISortFeature;
	paginate: IPaginateFeature;
	filters: IFilterFeature;
}

export class ListFeature {
	public sort: SortFeature;
	public paginate: PaginateFeature;
	public filters: FilterFeature;

	constructor(o: IListFeature) {
		this.sort = new SortFeature(o.sort);
		this.paginate = new PaginateFeature(o.paginate);
		this.filters = new FilterFeature(o.filters);
	}
}

export * from "./sort-feature/sort-feature";
export * from "./pagination-feature/pagination-feature";
export * from "./filter-feature/filter-feature";
