export default abstract class HttpCodeError extends Error {
	abstract statusCode: number;
}