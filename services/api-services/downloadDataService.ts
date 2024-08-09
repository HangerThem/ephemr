import { get } from "../requestHelpers"

export async function requestDownloadData(): Promise<Response> {
	return get("/me/download")
}
