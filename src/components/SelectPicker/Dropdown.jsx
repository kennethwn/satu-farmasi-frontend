import { SelectPicker } from "rsuite";
import propTypes from 'prop-types';
import Label from "../Input/Label";
import Text from "../Text";
import { useEffect, useRef } from "react";

export default function Dropdown({
    name,
    error = "",
    className,
    placeholder,
    value,
    defaultValue,
    onChange,
    label,
    id,
    ...props
}) {
    className = [className];

    const styles = {
        display: 'flex',
        width: '100%',
        color: '#111827', // Tailwind's gray-900
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Small shadow
        fontSize: '0.875rem', // 14px
        lineHeight: '1.5rem', // 24px
    };

    const containerSelect = useRef();

    const addNewClass = (newClass) => {
        const selectPicker = containerSelect.current?.querySelectorAll('.rs-picker-toggle');
        console.log('selectPicker', selectPicker);
        selectPicker.forEach((element) => {
            element.classList.add(newClass);
        });
    }

    const removeClass = (className) => {
        const selectPicker = containerSelect.current?.querySelectorAll('.rs-picker-toggle');
        selectPicker.forEach((element) => {
            element.classList.remove(className);
        });
    }

    useEffect(() => {
        if (error) addNewClass('error-field');
        else removeClass('error-field');
    }, [error])

    if (label) className.push('my-2 container-select');

    return (
        <>
            {label && <Label id={id} label={label} />}
            <div ref={containerSelect}>
                <SelectPicker
                    style={styles}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={className}
                    defaultValue={defaultValue}
                    value={value}
                    {...props}
                />
                {
                    error &&
                    <Text type="danger">{error}</Text>
                }
            </div>
        </>
        // <div className="block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6 ">
        // </div>
    )
}

Dropdown.propTypes = {
    className: propTypes.string,
    placeholder: propTypes.string,
    onChange: propTypes.func,
}
