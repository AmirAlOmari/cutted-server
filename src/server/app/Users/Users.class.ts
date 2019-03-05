import { SHA256 } from "crypto-js";
import { Document, Types } from "mongoose";
import { log } from "../../../utilities";
import { CRUD, IList } from "../features/CRUD/CRUD";
import { IFilterFeature, IListFeature, IPaginateFeature, ISortFeature, ListFeature } from "./../features/list-feature/list-feature";
import { sendEmail, SendEmailOptions } from "./../utilities/send-email.function";
import { IUser, Users } from "./Users.model";
import { encode } from "./../utilities/jwt";

export interface ILoginResponse {
	error?: string;
	data?: IUser & { token?: string };
}

export class UserClass implements CRUD<IUser> {
	private list_conditions: IListFeature = {
		sort: { by: "_id", order: "DESC" },
		paginate: { countOnPage: 0, page: 0 },
		filters: [],
	};

	private password_salt: string = "cutted";

	public async create(toCreate: IUser): Promise<Document & IUser> {
		return new Promise((resolve, reject) => {
			toCreate = this.resolveObject(toCreate);
			toCreate.password = this.hashPassword(<string>toCreate.password); // hashing password

			Users.create(toCreate)
				.then((user: Document & IUser) => {
					return resolve(user);
				})
				.catch(reject);
		});
	}

	public async register(toCreate: IUser): Promise<Document & IUser> {
		return new Promise((resolve, reject) => {
			this.create(toCreate)
				.then((user: Document & IUser) => {
					const sendEmailOptions: SendEmailOptions = {
						email: user.email as string,
						html: `<p style="color: red;">Hi, ${user.fname} ${user.lname}!</p>`,
					};

					resolve(user);

					sendEmail(sendEmailOptions).catch(error => log(`Couldnot send email to ${user.email}. Error: ${error.toString()}`, "red"));
				})
				.catch(reject);
		});
	}

	public async login(email: string, password: string): Promise<ILoginResponse> {
		return new Promise((resolve, reject) => {
			Users.findOne({ email })
				.exec()
				.then((user: Document & IUser & { token?: string } | null) => {
					let answer: ILoginResponse;
					if (!user) {
						answer = {
							error: "user does not exists",
						};
					} else {
						const token = encode({ userId: user._id });

						user.token = token;
						answer = {
							data: user,
						};
					}

					return resolve(answer);
				})
				.catch(reject);
		});
	}

	public async list(rawListFeatures: IListFeature): Promise<IList<IUser>> {
		return new Promise((resolve, reject) => {
			const listFeatures: IListFeature = {
				sort: rawListFeatures.sort || this.list_conditions.sort,
				paginate: rawListFeatures.paginate || this.list_conditions.paginate,
				filters: rawListFeatures.filters || this.list_conditions.filters,
			};

			const { sort, paginate, filters } = new ListFeature(listFeatures);

			Users.find(filters.compiled)
				.countDocuments()
				.exec()
				.then((wholeCount: number) => {
					Users.find(filters.compiled)
						.sort(sort.compile())
						.skip(paginate.skip)
						.limit(paginate.countOnPage)
						.exec()
						.then((users: Array<Document & IUser>) => {
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

	public async item(id: string | Types.ObjectId): Promise<Document & IUser | null> {
		return new Promise((resolve, reject) => {
			Users.findById(id)
				.exec()
				.then((user: Document & IUser | null) => {
					return resolve(user);
				})
				.catch(reject);
		});
	}

	public resolveObject(obj: IUser & any): IUser {
		return obj;
	}

	private hashPassword(password: string): string {
		return SHA256(password + this.password_salt).toString();
	}
}

export const User = new UserClass();
