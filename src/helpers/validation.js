import { z } from "zod";

// Base validation
const isString = () => z.string();
const isBoolean = () => z.boolean();

// Additional validation
const isEmail = () => isString().email({ message: "Email tidak valid" });
const isRequiredOptions = () =>
    isRequiredString()
    .or(
        z.boolean()
            .optional()
            .nullable()
            .refine((val) => val !== null && val !== undefined, {
                message: "Silahkan pilih opsi",
            })
    );
const isRequiredString = () =>
    isString().min(1, { message: "Bidang ini harus diisi" });
const isRequiredStringOptional = () =>
    isString().optional()
const isRequiredPhoneNumber = () =>
    z.coerce
        .number({ message: "Bidang isi harus diisi" })
        .min(1, { message: "Bidang isi harus diisi" })
        .refine(
            (val) => /^628\d{7,}$/.test(val ?? ""),
            "Nomor handphone harus diawali dengan 628 dan minimal 10 digit",
        );
const isPassword = () =>
    isString().min(8, { message: "Password minimal 8 karakter" });
const isRequiredNumber = () =>
    z
        .number({ message: "Bidang isi harus diisi" })
        .int({ message: "Angka tidak boelh desimal" })
        .positive()
        .min(1, { message: "Bidang isi harus diisi" });
const isRequiredNumberStartsFromZero = () =>
    z
        .number({ message: "Bidang isi harus diisi" })
        .int({ message: "Angka tidak boelh desimal" })
        .positive();
const isOptionalBoolean = () => isBoolean().optional();
const isOptionalString = () => isString().optional().nullable();
const isRequiredEmail = () =>
    isString()
        .min(1, { message: "Bidang isi harus diisi" })
        .email({ message: "Email tidak valid" });

const isRequiredDate = () =>
    z
        .date({
            errorMap: (issue, { defaultError }) => ({
                message:
                    issue.code === "invalid_union"
                        ? "Bidang ini harus diisi"
                        : defaultError,
            }),
        })
    .or(isRequiredString())

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
    isRequiredPhoneNumber,
    isRequiredDate,
    isRequiredNumberStartsFromZero,
    isRequiredStringOptional
};
