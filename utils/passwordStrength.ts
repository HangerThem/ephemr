import { commonPatterns } from "@/constants/commonPasswordRegex"

/**
 * Calculates the strength of a password based on various criteria.
 * @param password - The password to calculate the strength for.
 * @returns The strength score of the password, ranging from 0 to 100.
 */
export const calculatePasswordStrength = (password: string) => {
	let score = 0

	if (password.length < 8) {
		score -= 5
	} else if (password.length >= 8 && password.length <= 12) {
		score += 10
	} else {
		score += 25
	}

	if (/[A-Z]/.test(password)) {
		score += 15
	}

	if (/[a-z]/.test(password)) {
		score += 15
	}

	if (/\d/.test(password)) {
		score += 15
	}

	if (/[^A-Za-z0-9]/.test(password)) {
		score += 20
	}

	const repetitiveChars = /(.)\1{2,}/
	if (repetitiveChars.test(password)) {
		score -= 20
	}

	if (
		/[A-Z]/.test(password) &&
		/[a-z]/.test(password) &&
		/\d/.test(password) &&
		/[^A-Za-z0-9]/.test(password)
	) {
		score += 20
	}

	if (commonPatterns.test(password)) {
		score -= 30
	}

	score = Math.max(0, Math.min(score, 100))

	return score
}
