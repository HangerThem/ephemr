import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: Boolean(process.env.SMTP_SECURE),
	auth: {
	user: process.env.SMTP_USER,
	pass: process.env.SMTP_PASS,
	},
})

const sendEmail = async ({
	to,
	subject,
	text,
	html,
}: {
	to: string
	subject: string
	text: string
	html?: string
}) => {
	await transporter.sendMail({
	from: `${process.env.SMTP_NAME} <${process.env.SMTP_USER}>`,
	to,
	subject,
	text,
	html: html || text,
	})
}

export { sendEmail }
