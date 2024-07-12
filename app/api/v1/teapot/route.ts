import { iAmATeapotResponse, optionsResponse } from "@/helpers/apiHelper"

export async function GET() {
  return iAmATeapotResponse()
}

export async function OPTIONS() {
  return optionsResponse({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  })
}
