import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import api from "./configs/axios/satufarmasi-service-axios";

const roleBasedAccess = {
    // ADMIN
    "/master/staff": ["admin"],
    "/pharmacy": ["admin"],
    // DOCTOR
    "/diagnose": ["doctor"],
    // PHARMACIST
    "/prescription": ["pharmacist"],
    "/report": ["pharmacist"],
    "//transaction": ["pharmacist"],
    "/master": ["pharmacist"],
};

export const middleware = async (req) => {
    const path = req.nextUrl.pathname;
    const isPublicUrl = path === "/auth/login" || path === "/auth/register";
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    let userCurrentRole = "anonymous";

    // Authenticated user
    if (isPublicUrl && token) {
        try {
            userCurrentRole = await validateCookie(token);
            return NextResponse.redirect(new URL("/", req.url));
        } catch (err) {
            console.log("Token is invalid: ", err.message);
        }
    }
    if (!isPublicUrl) {
        if (!token)
            return NextResponse.redirect(new URL("/auth/login", req.url));
        try {
            userCurrentRole = await validateCookie(token);
        } catch (err) {
            console.warn("erorr in token", err);
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    }

    // Authorized user
    const baseRoute = Object.keys(roleBasedAccess).find((route) =>
        path.startsWith(route),
    );

    if ( baseRoute && !roleBasedAccess[baseRoute].includes(userCurrentRole.toLowerCase())) {
        return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        "/",
        "/diagnose/:path*",
        "/prescription/:path*",
        "/pharmacy/:path*",
        "/transaction/:path*",
        "/report/:path*",
        "/master/:path*",
        "/auth/:path*",
    ],
};

const validateCookie = async (token) => {
    console.log("valdiating token");
    return await api
        .post("/api/v1/users/check-token", { token })
        .then((res) => res.role)
        .catch((err) => {
            throw new Error(err.response.data.error);
        });
};
