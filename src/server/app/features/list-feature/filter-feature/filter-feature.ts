import { CompilableFeature } from "../compilable-feature";
import { BooleanFilter, IBooleanFilter } from "./boolean-filter/boolean-filter";
import { INumberFilter, NumberFilter } from "./number-filter/number-filter";
import { IStringFilter, StringFilter } from "./string-filter/string-filter";

enum IdentifiedFilter {
	NumberFilter,
	StringFilter,
	BooleanFilter,
}

const identifyFilter = (filter: INumberFilter | any): IdentifiedFilter => {
	switch (true) {
		case typeof filter.min === "number" || typeof filter.max === "number":
			return IdentifiedFilter.NumberFilter;

		case typeof filter.value === "string":
			return IdentifiedFilter.StringFilter;

		case typeof filter.value === "boolean":
			return IdentifiedFilter.BooleanFilter;

		default:
			throw new Error(`identifyFilter(): Cannot identify type of filter ${filter}`);
	}
};

type TFilterInput = INumberFilter | IStringFilter | IBooleanFilter;
type TFilterOutput = NumberFilter | StringFilter | BooleanFilter;

export type IFilterFeature = Array<TFilterInput>;

export class FilterFeature extends Array<TFilterOutput> implements CompilableFeature {
	public static compile(this: Array<TFilterOutput>) {
		const o: any = {};
		for (const filter of this) {
			const compiled = filter.compile();

			if (!Object.getOwnPropertyNames(compiled).length) {
				continue;
			}

			o[filter.by] = compiled;
		}
		return o;
	}

	public compiled: any;

	constructor(filtersInput: Array<TFilterInput>) {
		const filtersOutput = filtersInput.map((filter) => {
			switch (identifyFilter(filter)) {
				case IdentifiedFilter.NumberFilter:
					return new NumberFilter(<NumberFilter> filter);

				case IdentifiedFilter.StringFilter:
					return new StringFilter(<IStringFilter> filter);

				case IdentifiedFilter.BooleanFilter:
					return new BooleanFilter(<BooleanFilter> filter);

				default:
					throw new Error(`new FilterFeature(): Cannot identify type of filter ${filter}`);
			}
		});
		super(...filtersOutput);
		this.compiled = FilterFeature.compile.call(filtersOutput);
	}

	public compile() {
		const o: any = {};
		for (const filter of this) {
			const compiled = filter.compile();

			if (!Object.getOwnPropertyNames(compiled).length) {
				continue;
			}

			o[filter.by] = compiled;
		}
		return o;
	}
}
