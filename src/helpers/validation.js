import { z } from "zod";

// Base validation
const isString = () => z.string()
const isBoolean = () => z.boolean()

// Additional validation
const isEmail = () => isString().email({ message: 'Invalid email address' })
const isRequiredString = () => isString().min(1, { message: 'This field is required' }).nullable().refine(value => value !== null, {
	message: 'This field is required'
})
const isPassword = () => isString().min(8, { message: 'Password is minimum 8 characters' })
const isRequiredNumber = () => z.number().int().positive().min(1, { message: 'This field is required' })
const isOptionalBoolean = () => isBoolean().optional()
const isOptionalString = () => isString().optional()
const isRequiredEmail = () => isRequiredString().email({ message: 'Invalid email address' })

export {
	isString,
	isBoolean,
	isEmail,
	isRequiredString,
	isPassword,
	isOptionalBoolean,
	isOptionalString,
	isRequiredEmail,
	isRequiredNumber
}
