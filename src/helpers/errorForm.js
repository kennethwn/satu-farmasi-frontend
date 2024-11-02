// setError is from useForm
export const ErrorForm = (error, setError) => {
	error.forEach(errorObject => {
		Object.entries(errorObject).forEach(([field, details]) => {
			Object.entries(details).forEach(([key, value]) => {
				if (key === "msg") {
					setError(field, {
						type: "custom",
						message: value,
					});
				}
			});
		});
	});
}
