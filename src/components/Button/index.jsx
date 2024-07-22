import propTypes from 'prop-types'

export default function Button(props) {
    const className = [props.className]
    const {
        type = 'primary',
        href,
        target,
        size = 'medium',
        appendIcon,
        prependIcon,
        isDisabled = false,
        isLoading,
    } = props

    if (type === 'primary') className.push(' bg-button-primary text-white hover:bg-hover-dark')
    if (type === 'danger') className.push(' bg-button-danger text-danger hover:bg-danger hover:text-white')

    if (size === 'small') className.push(` text-sm inline-block py-2 ${isLoading || appendIcon ? 'px-4' : 'px-6'}`)
    if (size === 'medium') className.push(`inline-block py-2.5 ${isLoading || appendIcon ? 'px-4' : 'px-6'}`)

    const onClick = () => {
        if (props.onClick && !isLoading) props.onClick()
    }

    return (
        <div className={`select-none rounded-lg font-semibold cursor-pointer ${className.join(" ")}`} disabled={isDisabled} onClick={onClick}>
            <div className='flex flex-row items-center gap-2 place-content-center '>
                {
                     prependIcon && (<div>{prependIcon}</div>)
                }
                <div>{props.children}</div>
                { 
                    isLoading ? (
                        <div className='transition-all duration-300'>
                            <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        appendIcon && (<div>{appendIcon}</div>)
                    )
                }
            </div>
        </div>
    )

}

Button.propTypes = {
    type: propTypes.oneOf(['primary','danger']),
    href: propTypes.string,
    onClick: propTypes.func,
    target: propTypes.string,
    className: propTypes.string,
    prependIcon: propTypes.object,
    appendIcon: propTypes.object,
    size: propTypes.oneOf(['small','medium','large','flex']),
    isDisabled: propTypes.bool,
    isLoading: propTypes.bool
}