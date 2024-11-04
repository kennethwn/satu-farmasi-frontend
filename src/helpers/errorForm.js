// setError is from useForm
export const ErrorForm = (error, setError, useForm = true) => {
    error.forEach((errorObject) => {
        Object.entries(errorObject).forEach(([field, details]) => {
            Object.entries(details).forEach(([key, value]) => {
                if (key === "msg") {
                    if (useForm) {
                        setError(field, {
                            type: "custom",
                            message: value,
                        });
                    } else {
                        setError((prevErr) => ({
                            ...prevErr,
                            [field]: value,
                        }));
                    }
                }
            });
        });
    });
};
