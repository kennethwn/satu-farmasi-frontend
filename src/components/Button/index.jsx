import propTypes from 'prop-types'

export default function Button(props) {
    const className = [props.className]
    const {
        appearance = 'primary',
        type,
        href,
        target,
        size = 'medium',
        appendIcon,
        prependIcon,
        isDisabled = false,
        isLoading,
    } = props

    if (appearance === 'primary') className.push('bg-button-primary text-white hover:bg-hover-dark')
    if (appearance === 'danger') className.push('bg-button-danger text-danger hover:bg-danger hover:text-white')
    if (appearance === 'subtle') className.push('bg-button-subtle text-dark hover:bg-hover-light')

    if (size === 'small') className.push(`text-sm font-medium inline-block py-2 ${isLoading || appendIcon ? 'px-4' : 'px-6'}`)
    if (size === 'medium') className.push(`inline-block font-semibold py-2.5 ${isLoading || appendIcon ? 'px-4' : 'px-6'}`)

    // WHY THIS BUTTON IS NOT WORKING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const onClick = () => {
        if (props.onClick && !isLoading) {
            props.onClick()
        }     
    }

    return (
        <button 
            className={`select-none rounded-lg cursor-pointer ${className.join(" ")}`} 
            type={type}
            disabled={isDisabled} 
            onClick={onClick}
            {...(href ? { href, target } : {})}
        >
            <div className='flex flex-row items-center gap-2 place-content-center'>
                {
                    prependIcon && (<div>{prependIcon}</div>)
                }
                <div className='text-body'>{props.children}</div>
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
        </button>
    )
}

Button.propTypes = {
    appearance: propTypes.oneOf(['primary', 'danger']),
    type: propTypes.string,
    href: propTypes.string,
    onClick: propTypes.func,
    target: propTypes.string,
    className: propTypes.string,
    prependIcon: propTypes.node,
    appendIcon: propTypes.node,
    size: propTypes.oneOf(['small', 'medium', 'large', 'flex']),
    isDisabled: propTypes.bool,
    isLoading: propTypes.bool,
}
