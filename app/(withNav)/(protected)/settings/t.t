			<SettingsActions>
				

				<section id="notifications">
					<h2>Notifications</h2>
					<p>Update your notification settings</p>
					<FormField>
						<FormInput type="checkbox" name="emailNotifications" />
						<FormLabel>Email Notifications</FormLabel>
					</FormField>
					<FormField>
						<FormInput type="checkbox" name="pushNotifications" />
						<FormLabel>Push Notifications</FormLabel>
					</FormField>
				</section>

				<section id="data">
					<h2>Data</h2>
					<p>Download your data</p>
					<Button onClick={() => downloadDataService()} size="large">
						Download Data
					</Button>
					<p>Delete your account</p>
					<Button className="danger" size="large">
						Delete Account
					</Button>
				</section>

				<section>
					<Button
						onClick={async () => {
							const form = document.querySelector("form")
							const formData = new FormData(form)
							const data = Object.fromEntries(formData.entries())
							const profilePic = formData.get("profilePic")
							if (profilePic) {
								const file = profilePic as File
								setImage(file)
								await requestUpdateProfilePic(file)
							}
							await requestUpdateMe(data)
							getUser()
						}}
						size="large"
					>
						Save Changes
					</Button>
				</section>
			</SettingsActions>