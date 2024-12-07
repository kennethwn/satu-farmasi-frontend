import { z } from "zod";

// Base validation
const isString = () => z.string();
const isBoolean = () => z.boolean();

// Additional validation
const isEmail = () => isString().email({ message: "Email tidak valid" });
const isRequiredOptions = () =>
    isString()
        .nullable()
        .refine((val) => val !== null, {
            message: "Silahkan pilih opsi",
        });
const isRequiredString = () =>
    isString().min(1, { message: "Bidang isi harus diisi" });
const isRequiredPhoneNumber = () =>
    z
        .coerce
        .number({ message: "Bidang isi harus diisi" })
        .min(1, { message: "Bidang isi harus diisi" })
        .refine(
            (val) => /^628\d{7,}$/.test(val ?? ""),
            "Nomor handphone harus diawali dengan 628 dan minimal 10 digit",
        );
const isPassword = () =>
    isString().min(8, { message: "Password is minimum 8 characters" });
const isRequiredNumber = () =>
    z
        .number({ message: "Bidang isi harus diisi" })
        .int({ message: "Angka tidak boelh desimal" })
        .positive()
        .min(1, { message: "Bidang isi harus diisi" });

const isOptionalBoolean = () => isBoolean().optional();
const isOptionalString = () => isString().optional();
const isRequiredEmail = () =>
    isString()
        .min(1, { message: "Bidang isi harus diisi" })
        .email({ message: "Email tidak valid" });

const isRequiredDate = () =>
    z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Bidang isi harus diisi dan harus tanggal yang valid",
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
    isRequiredPhoneNumber,
    isRequiredDate,
};
