import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import api from "./configs/axios/satufarmasi-service-axios"

export const middleware = async (req) => {
    const path = req.nextUrl.pathname
    const isPublicUrl = path === '/auth/login' || path === '/auth/register'
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    if (isPublicUrl && token) {
        try {
            await validateCookie(token)
            return NextResponse.redirect(new URL('/', req.url))
        } catch (err) {
            console.log("Token is invalid: ", err.message);
        }
    }
    if (!isPublicUrl) {
        if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))
        try {
            await validateCookie(token)
        } catch (err) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/diagnose/:path*",
        "/prescribe/:path*",
        "/transaction/:path*",
        "/report/:path*",
        "/master/:path*",
        "/auth/:path*",
    ],
}

const validateCookie = async (token) => {
    await api.post("/api/v1/users/check-token", { token })
    .catch(err => {
        throw new Error(err.response.data.error)
    });
}
