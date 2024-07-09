import { useRouter } from 'next/router';
import React, { useState } from 'react'

export default function useUser() {
    const router = useRouter(); //👈 buat pindah halaman
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    // TODO: add logic for login

    // TODO: add logic for fetching logged user

    // TODO: add logic for update user

    // TODO: add logic for logout

    return {
        isLoading,
        user,
    }
}
