"use client"

import { FormField, FormLabel } from "@/components/forms/formStyles"
import {
	requestExperience,
	requestUpdateExperience,
} from "@/services/api-services/experienceService"
import {
	requestLanguages,
	requestThemes,
} from "@/services/api-services/appDataServices"
import {
	Section,
	SectionsContainer,
} from "@/components/settings/settingsStyles"
import { CaretDown } from "react-bootstrap-icons"
import {
	DropdownContainer,
	DropdownContent,
	DropdownItem,
	DropdownSelection,
} from "@/components/dropdownStyles"
import { useEffect, useState, useRef } from "react"
import { isError } from "@/utils/isError"
import Button from "@/components/buttons/button"

export default function Page() {
	const langDropdownRef = useRef<HTMLDivElement>(null)
	const [langDropdown, setLangDropdown] = useState<boolean>(false)
	const [langDropdownPosition, setLangDropdownPosition] =
		useState<string>("bottom")
	const themeDropdownRef = useRef<HTMLDivElement>(null)
	const [themeDropdown, setThemeDropdown] = useState<boolean>(false)
	const [themeDropdownPosition, setThemeDropdownPosition] =
		useState<string>("bottom")
	const [experiences, setExperiences] = useState<IExperience | null>(null)
	const [languages, setLanguages] = useState<ILanguage[] | null>(null)
	const [themes, setThemes] = useState<ITheme[] | null>(null)

	useEffect(() => {
		const populateData = async () => {
			const [experiencesData, languagesData, themesData] = await Promise.all([
				requestExperience(),
				requestLanguages(),
				requestThemes(),
			])

			if (
				isError(experiencesData) ||
				isError(languagesData) ||
				isError(themesData)
			) {
				console.error("Error fetching data")
				return
			}

			setExperiences(experiencesData.experience)
			setLanguages(languagesData.languages)
			setThemes(themesData.themes)
		}

		populateData()
	}, [])

	useEffect(() => {
		if (langDropdown) {
			const dropdownRect = langDropdownRef.current?.getBoundingClientRect()
			const viewportHeight = window.innerHeight

			if (
				dropdownRect &&
				dropdownRect.y + dropdownRect.bottom > viewportHeight
			) {
				setLangDropdownPosition("top")
			} else {
				setLangDropdownPosition("bottom")
			}
		}
	}, [langDropdown])

	useEffect(() => {
		if (themeDropdown) {
			const dropdownRect = themeDropdownRef.current?.getBoundingClientRect()
			const viewportHeight = window.innerHeight

			if (
				dropdownRect &&
				dropdownRect.y + dropdownRect.bottom > viewportHeight
			) {
				setThemeDropdownPosition("top")
			} else {
				setThemeDropdownPosition("bottom")
			}
		}
	}, [themeDropdown])

	const handleSave = async () => {
		const response = await requestUpdateExperience(
			experiences as IUpdateExperience
		)

		if (isError(response)) {
			console.error("Error updating experience")
			return
		}

		setExperiences(response.experience)
	}

	if (typeof window !== "undefined") {
		window.addEventListener("click", (e) => {
			if (
				langDropdownRef.current &&
				!langDropdownRef.current.contains(e.target as Node)
			) {
				setLangDropdown(false)
			}
			if (
				themeDropdownRef.current &&
				!themeDropdownRef.current.contains(e.target as Node)
			) {
				setThemeDropdown(false)
			}
		})

		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				setLangDropdown(false)
				setThemeDropdown(false)
			}
		})
	}

	if (!experiences || !languages || !themes) {
		return (
			<SectionsContainer>
				<h2>Experience</h2>
				<Section></Section>
			</SectionsContainer>
		)
	}

	return (
		<SectionsContainer>
			<h2>Experience</h2>
			<Section>
				<p> - Under construction - </p>
				<FormField>
					<DropdownContainer ref={langDropdownRef} className="full-width">
						<DropdownSelection onClick={() => setLangDropdown(!langDropdown)}>
							{experiences?.language.charAt(0).toUpperCase() +
								experiences?.language.slice(1).toLowerCase()}
							<CaretDown />
						</DropdownSelection>
						<DropdownContent
							$visible={langDropdown}
							$position={langDropdownPosition as "top" | "bottom"}
							className="input-dropdown"
							onClick={() => setLangDropdown(false)}
						>
							{languages.map((language) => (
								<DropdownItem
									key={language.id}
									onClick={() => {
										setExperiences({
											...experiences,
											language: language.id,
										})
									}}
								>
									{language.name}
								</DropdownItem>
							))}
						</DropdownContent>
					</DropdownContainer>
					<FormLabel className="bg-transparent">Language</FormLabel>
				</FormField>

				<FormField>
					<DropdownContainer ref={themeDropdownRef} className="full-width">
						<DropdownSelection onClick={() => setThemeDropdown(!themeDropdown)}>
							{experiences?.theme.charAt(0).toUpperCase() +
								experiences?.theme.slice(1).toLowerCase()}
							<CaretDown />
						</DropdownSelection>
						<DropdownContent
							$visible={themeDropdown}
							$position={themeDropdownPosition as "top" | "bottom"}
							className="input-dropdown"
							onClick={() => setThemeDropdown(false)}
						>
							{themes.map((theme) => (
								<DropdownItem
									key={theme.id}
									onClick={() => {
										setExperiences({
											...experiences,
											theme: theme.id,
										})
									}}
								>
									{theme.name}
								</DropdownItem>
							))}
						</DropdownContent>
					</DropdownContainer>
					<FormLabel className="bg-transparent">Theme</FormLabel>
				</FormField>

				<Button onClick={handleSave}>Save</Button>
			</Section>
		</SectionsContainer>
	)
}
