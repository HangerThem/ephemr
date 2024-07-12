/**
 * Checks if the given response is an error response.
 * @param response - The response object to check.
 * @returns True if the response is an error response, false otherwise.
 */
export const isError = (response: any): response is IErrorResponse => {
  return (response as IErrorResponse).error !== undefined
}
