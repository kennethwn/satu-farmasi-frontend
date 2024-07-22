import React from 'react'
import propTypes from 'prop-types'

export default function Input(props) {
    const className = [props.className];
    const { 
        type = 'text',
        label, 
        id, 
        name, 
        onChange, 
        disabled = false, 
        placeholder = 'john doe', 
        register = () => {},
        value,
    } = props;

    if (disabled === true) className.push(' bg-[#D9D9D9] cursor-not-allowed');
    if (label) className.push('mt-2');

    return (
        <div className='w-full'>
            {
                label && 
                    <label htmlFor={name} className="block text-sm font-medium leading-6 text-dark">
                        {label}
                    </label>
            }
            <input
                type={type}
                id={id}
                name={name}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                className={`block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6 ${className.join(" ")}`}
            />
        </div>
    )
}

Input.propTypes = {
    type: propTypes.oneOf(['text', 'number', 'email', 'password', 'tel', 'date', 'checkbox', "radio"]),
    label: propTypes.string,
    id: propTypes.string,
    name: propTypes.string,
    onChange: propTypes.func,
    disabled: propTypes.bool,
    placeholder: propTypes.string,
    value: propTypes.string,
    className: propTypes.string,
    checked: propTypes.bool,
    register: propTypes.func
}