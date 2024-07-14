import prisma from "@/helpers/prismaHelper"
import { sendEmail } from "@/utils/emailUtils"
import {
  internalServerErrorResponse,
  optionsResponse,
  unauthorizedResponse,
  badRequestResponse,
  successResponse,
} from "@/helpers/apiHelper"

export async function POST(req: any) {
  try {
    const { usernameOrEmail, code } = await req.json()

    if (!usernameOrEmail) {
      return badRequestResponse("Username or email is required")
    }

    if (!code) {
      return badRequestResponse("Code is required")
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: usernameOrEmail,
          },
          {
            email: usernameOrEmail,
          },
        ],
      },
      select: {
        id: true,
        verificationCode: true,
        email: true,
        username: true,
      },
    })

    if (!user) {
      return unauthorizedResponse("User not found")
    }

    if (user.verificationCode !== code) {
      return unauthorizedResponse("Invalid code")
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        verificationCode: null,
      },
    })

    await sendEmail({
      to: user.email,
      subject: "Welcome to Ephemr",
      text: `Hello ${user.username},\n\nYour account has been verified.\n\nRegards,\nEphemeris Team`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=K2D:wght@400&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'K2D', Arial, sans-serif;
                background-color: #0c0c11;
                color: #fff;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #212121;
                color: #3498db;
                text-align: center;
                padding: 20px 0;
              }
              .content {
                padding: 20px;
                background-color: #0c0c11;
              }
              .button {
                display: inline-block;
                cursor: pointer;
                color: #3498db;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Ephemr</h1>
              </div>
              <div class="content">
                <p>Hello ${user.username},</p>
                <p>We're excited to have you on board! Your account has been successfully verified, and you're all set to start exploring everything Ephemr has to offer.</p>
                <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@ephemr.net" class="button">support@ephemr.net</a>.</p>
                <p>Best regards,<br>Ephemr Team</p>
                <p><i>If you didn't initiate this action, please contact our support team immediately at <a href="mailto:support@ephemr.net" class="button">support@ephemr.net</a>.</i></p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return successResponse({ message: "Account verified" })
  } catch (e) {
    console.error("Error verifying account: ", e)
    return internalServerErrorResponse()
  }
}

export async function OPTIONS() {
  return optionsResponse({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
  })
}
