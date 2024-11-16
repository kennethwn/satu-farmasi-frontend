export const resolveIsPaidStatus = (status) => {
    if (status) {
        return (
            <div className="flex w-full">
                <div className="w-full px-2 py-1 text-base font-medium" style={{ color: '#22c55e', backgroundColor: '#dcfce7' }}>
                    <div className="flex-initial max-w-full text-sm font-semibold leading-none text-center">Lunas</div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex w-full">
                <div className="w-full px-2 py-1 text-base font-medium" style={{ color: '#ef4444', backgroundColor: '#fee2e2' }}>
                    <div className="flex-initial max-w-full text-sm font-semibold leading-none text-center">Belum Lunas</div>
                </div>
            </div>
        )
    }
}