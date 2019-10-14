import HttpCodeError from './HttpCodeError';

/**
 * 400 Bad Request — сервер обнаружил в запросе клиента синтаксическую ошибку. Появился в HTTP/1.0.
 */
export default class HttpCodeBadRequestError extends HttpCodeError {
	statusCode = 400;

}