import { get } from "../requestHelpers"

export async function downloadDataService(): Promise<Response> {
  return get("/me/download")
}
