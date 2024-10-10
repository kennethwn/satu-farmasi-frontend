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
        autofocus = false,
        currency = false
    } = props;

    if (disabled === true) className.push(' cursor-not-allowed');
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
            {
                currency ?
                    <div className="relative">
                        <div className="py-2 text-sm absolute px-4"
                        >
                            <span className='text-gray-400'>IDR</span>
                            <span className="mx-2 text-base text-gray-300">|</span>
                        </div>
                        <input
                            type={type}
                            id={id}
                            name={name}
                            onChange={onChange}
                            disabled={disabled}
                            placeholder={placeholder}
                            value={value}
                            className={`block w-full rounded-md px-14 border py-2 text-dark border-gray-300 shadow-sm placeholder:text-gray-400 sm:text-md sm:leading-6 ${className.join(" ")}`}
                            // className={`block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6 ${className.join(" ")}`}
                            autoFocus={autofocus}
                            {...register(name)}
                        />
                    </div>
                    :
                    <input
                        type={type}
                        id={id}
                        name={name}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value}
                        className={`block w-full rounded-md px-4 border py-2 text-dark border-gray-300 shadow-sm placeholder:text-gray-400 sm:text-md sm:leading-6 ${className.join(" ")}`}
                        // className={`block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6 ${className.join(" ")}`}
                        autoFocus={autofocus}
                        {...register(name)}
                    />
            }
            <div>
                {
                    error &&
                    <Text type="danger">{error}</Text>
                }
            </div>
        </div>
    )
}

const Label = ({ id, label }) =>
    <label htmlFor={id} className="block text-sm font-medium leading-2 text-dark">
        {label}
    </label>

Label.propTypes = {
    id: propTypes.string.isRequired,
    label: propTypes.string.isRequired
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
    currency: propTypes.string
}
