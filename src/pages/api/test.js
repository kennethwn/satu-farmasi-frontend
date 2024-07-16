'use server';
import { cookies } from "next/headers"

export default async function saveCookies(token) {
    cookies, set('token', token)
}