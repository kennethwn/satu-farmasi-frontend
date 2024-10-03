import React  from 'react'
import propTypes from 'prop-types'
import Text from '../Text';
import { Radio, Checkbox } from 'rsuite';
import Label from './Label';
export default function Input(props) {
    const className = [props.className];
    const {
        type = 'text',
        label,
        error = "",
        id,
        name,
        onChange,
        disabled = false,
        placeholder = 'john doe',
        register = () => { },
        value,
        autofocus = false
    } = props;

    if (disabled === true) className.push(' bg-[#D9D9D9] cursor-not-allowed');
    if (label) className.push('my-2');

    if (type === "checkbox") {
        return (
            <div className='flex justify-start items-center w-full'>
                <Checkbox id={id} name={name} {...register(name)} onChange={onChange} value={value} />
                <Label name={name} label={label} />
            </div>
        )
    }

    if (type === "radio") {
        return (
            <div className='flex justify-start items-center'>
                <Radio id={id} name={name} {...register(name)} onChange={() => onChange(value)} value={value} />
                <Label id={id} label={label} />
            </div>
        )
    }

    return (
        <div className='w-full'>
            {
                label &&
                <Label id={id} label={label} />
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
                autoFocus={autofocus}
                {...register(name)}
            />
            <div style={{ minHeight: '22px' }}>
                {
                    error &&
                    <Text type="danger">{error}</Text>
                }
            </div>
        </div>
    )
}
Input.propTypes = {
    type: propTypes.oneOf(['text', 'number', 'email', 'password', 'tel', 'date', 'checkbox', "radio"]),
    label: propTypes.string,
    error: propTypes.string,
    autofocus: propTypes.bool,
    id: propTypes.string,
    name: propTypes.string,
    onChange: propTypes.func,
    disabled: propTypes.bool,
    placeholder: propTypes.string,
    value: propTypes.string,
    className: propTypes.string,
    checked: propTypes.bool,
    register: propTypes.func,
}
