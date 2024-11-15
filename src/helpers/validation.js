import { z } from "zod";

// Base validation
const isString = () => z.string();
const isBoolean = () => z.boolean();

// Additional validation
const isEmail = () => isString().email({ message: "Invalid email address" });
const isRequiredOptions = () =>
    isString()
        .nullable()
        .refine((val) => val !== null, {
            message: "Please select an option",
        });
const isRequiredString = () =>
    isString().min(1, { message: "This field is required" });
const isPassword = () =>
    isString().min(8, { message: "Password is minimum 8 characters" });
const isRequiredNumber = () =>
    z
        .number({ message: "This field is required" })
        .int({ message: "Number cannot be decimal" })
        .positive()
        .min(1, { message: "This field is required" });

const isOptionalBoolean = () => isBoolean().optional();
const isOptionalString = () => isString().optional();
const isRequiredEmail = () =>
    isString()
        .min(1, { message: "This field is required" })
        .email({ message: "Invalid email address" });

const isRequiredDate = () =>
    z.date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "This field is required and must be a valid date"
    });

export {
    isString,
    isBoolean,
    isEmail,
    isRequiredString,
    isPassword,
    isOptionalBoolean,
    isOptionalString,
    isRequiredEmail,
    isRequiredNumber,
    isRequiredOptions,
    isRequiredDate
};
