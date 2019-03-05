import { Document, Types } from "mongoose";
import { IFilterFeature, IListFeature, IPaginateFeature, ISortFeature } from "../list-feature/list-feature";

export interface IList<T> {
	array: Array<T & Document>;
	sort: ISortFeature;
	paginate: IPaginateFeature;
	filters: IFilterFeature;
}

export type Id = string | Types.ObjectId;

export interface CRUD<T> {
	create(object: T, ...args: any): Promise<T & Document>;
	list(lf: IListFeature): Promise<IList<T>>;
	item(id: Id): Promise<T & Document | null>;
	update?(object: T): Promise<T & Document>;
	delete?(id: Id): Promise<boolean>;
}
