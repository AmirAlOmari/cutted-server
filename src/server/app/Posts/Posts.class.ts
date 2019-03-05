import { Document, Types } from "mongoose";
import { EventEmitter } from "events";
import { log } from "../../../utilities";
import { CRUD, IList } from "../features/CRUD/CRUD";
import { IFilterFeature, IListFeature, IPaginateFeature, ISortFeature, ListFeature } from "../features/list-feature/list-feature";
import { IPost, Posts, IRate, IComment } from "./Posts.model";
import { Users } from "../Users/Users.model";

export class PostClass extends EventEmitter implements CRUD<IPost> {
	private list_conditions: IListFeature = {
		sort: { by: "_id", order: "DESC" },
		paginate: { countOnPage: 0, page: 0 },
		filters: [],
	};

	public async create(toCreate: IPost, userId: string | Types.ObjectId): Promise<Document & IPost> {
		return new Promise((resolve, reject) => {
			toCreate = this.resolveObject(toCreate);
			(<any>toCreate.userId) = userId;

			Posts.create(toCreate)
				.then((post: Document & IPost) => {
					resolve(post);

					Users.findByIdAndUpdate(userId, { $push: { posts: post._id } })
						.exec()
						.then();
				})
				.catch(reject);
		});
	}

	public async list(rawListFeatures: IListFeature): Promise<IList<IPost>> {
		return new Promise((resolve, reject) => {
			const listFeatures: IListFeature = {
				sort: rawListFeatures.sort || this.list_conditions.sort,
				paginate: rawListFeatures.paginate || this.list_conditions.paginate,
				filters: rawListFeatures.filters || this.list_conditions.filters,
			};

			const { sort, paginate, filters } = new ListFeature(listFeatures);

			Posts.find(filters.compiled)
				.countDocuments()
				.exec()
				.then((wholeCount: number) => {
					Posts.find(filters.compiled)
						.sort(sort.compile())
						.skip(paginate.skip)
						.limit(paginate.countOnPage)
						.exec()
						.then((users: Array<Document & IPost>) => {
							resolve({
								array: users,
								sort,
								paginate: paginate.compile(wholeCount),
								filters,
							});
						})
						.catch(reject);
				})
				.catch(reject);
		});
	}

	public async item(id: string | Types.ObjectId): Promise<Document & IPost | null> {
		return new Promise((resolve, reject) => {
			Posts.findById(id)
				.exec()
				.then((post: Document & IPost | null) => {
					resolve(post);

					if (post) {
						this.viewIncrement(post);
					}
				})
				.catch(reject);
		});
	}

	public async viewIncrement(post: Document & IPost): Promise<void> {
		return new Promise((resolve, reject) => {
			(post.views as number)++;
			post.save()
				.then(_ => {
					return resolve();
				})
				.catch(reject);
		});
	}

	public async ratePost(id: string | Types.ObjectId, userId: string | Types.ObjectId, rate: number): Promise<void> {
		return new Promise((resolve, reject) => {
			const toPush: IRate = {
				userId: Types.ObjectId(userId.toString()),
				rate,
				time: new Date().getTime(),
			};

			Posts.findByIdAndUpdate(id, { $push: { rates: toPush } })
				.exec()
				.then(_ => {
					resolve();
				})
				.catch(reject);
		});
	}

	public async commentPost(id: string | Types.ObjectId, userId: string | Types.ObjectId, comment: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const toPush: IComment = {
				userId: Types.ObjectId(userId.toString()),
				comment,
				rates: [],
				comments: [],
			};

			Posts.findByIdAndUpdate(id, { $push: { comments: toPush } })
				.exec()
				.then(_ => {
					resolve();
				})
				.catch(reject);
		});
	}

	public resolveObject(obj: IPost & any): IPost {
		return {
			title: obj.title,
			content: obj.content,
			avgRate: 0,
			views: 0,
			rates: [],
			comments: [],
		};
	}
}

export const Post = new PostClass();
