export const resolveIsPaidStatus = (status) => {
    if (status) {
        return (
            <div className="flex w-full">
                <div className="w-full px-2 py-1 text-base font-medium text-green-500 bg-green-100">
                    <div className="flex-initial max-w-full text-sm font-semibold leading-none text-center">Lunas</div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex w-full">
                <div className="w-full px-2 py-1 text-base font-medium text-red-500 bg-red-100">
                    <div className="flex-initial max-w-full text-sm font-semibold leading-none text-center">Belum Lunas</div>
                </div>
            </div>
        )
    }
}