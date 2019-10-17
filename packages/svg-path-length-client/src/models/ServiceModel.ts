export interface IServiceError {
	message: string;
	name: string;
	stack: string[];
	status: number;
}

export class ServiceError extends Error {
	status: number;
	methodName: string;
	constructor(params: IServiceError & {methodName: string;}) {
		super(params.message);
		this.methodName = params.methodName;
		this.status = params.status;
		this.name = params.name;
		this.stack = params.stack.join('\n');
	}
}

export default class ServiceModel {
	private static host = process.env.REACT_APP_HOST;
	private static port = process.env.REACT_APP_PORT;

	private static get urlMethodPrefix(): string {
		return `http://${this.host}:${this.port}`;
	}

	private static getUrl(methodName: string): string {
		return `${this.urlMethodPrefix}/${methodName}`;
	}

	private static async fetch(methodName: string, params?: RequestInit) {
		return await fetch(this.getUrl(methodName), params);
	}

	private static async fetchJson<R>(methodName: string, params?: RequestInit) {
		const response = await fetch(this.getUrl(methodName), params);
		if (!response.ok) {
			const error = await response.json() as IServiceError;
			throw new ServiceError({...error, methodName});
		}
		return await response.json() as R;

	}

	static async get(methodName: string, params?: RequestInit) {
		return this.fetch(methodName, {method: 'get', ...params});
	}

	static async post(methodName: string, params?: RequestInit) {
		return this.fetch(methodName, {method: 'post', ...params});
	}

	static async getJson<R>(methodName: string, params?: RequestInit) {
		return this.fetchJson<R>(methodName, {method: 'get', ...params});
	}

	static async postJson<R>(methodName: string, params?: RequestInit) {
		return this.fetchJson<R>(methodName, {method: 'post', ...params});
	}
}