import React from 'react'
import propTypes from 'prop-types'

export default function Input(props) {
    const className = [props.className];
    const { 
        type, 
        id, 
        name, 
        onChange, 
        disabled, 
        placeholder, 
        register,
        value 
    } = props;

    if (disabled === true) className.push(' bg-[#D9D9D9] cursor-not-allowed');

    return (
        <input
            type={type}
            id={id}
            name={name}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            className={`block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6 ${className.join(" ")}`}
            {...register(name)} 
        />
    )
}

Input.defaultProps = {
    type: 'text',
    disabled: false,
    placeholder: 'field name',
}

Input.propTypes = {
    type: propTypes.oneOf(['text', 'number', 'email', 'password', 'tel', 'date', 'checkbox']),
    id: propTypes.string,
    name: propTypes.string,
    onChange: propTypes.func,
    disabled: propTypes.bool,
    placeholder: propTypes.string,
    value: propTypes.string,
    className: propTypes.string,
    register: propTypes.func
}