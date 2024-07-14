import React from 'react'
import propTypes from 'prop-types'

export default function Select(props) {
    const className = [props.className];
    const { 
        id, 
        name, 
        onChange, 
        disabled, 
        placeholder, 
        value 
    } = props;

    if (disabled === true) className.push(' bg-[#D9D9D9] cursor-not-allowed');

    return (
        <select
            id={id}
            name={name}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            className={`block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6 ${className.join(" ")}`}
        />
    )
}

Select.defaultProps = {
    type: 'text',
    disabled: false,
    placeholder: 'field name',
}

Select.propTypes = {
    id: propTypes.string,
    name: propTypes.string,
    onChange: propTypes.func,
    disabled: propTypes.bool,
    placeholder: propTypes.string,
    value: propTypes.string,
    className: propTypes.string
}