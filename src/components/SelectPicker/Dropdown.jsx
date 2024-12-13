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
    placement = "auto",
    ...props
}) {
    const classNames = [className];
    const containerRef = useRef(null);

    const styles = {
        display: 'flex',
        width: '100%',
        color: '#111827', // Tailwind's gray-900
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Small shadow
        fontSize: '0.875rem', // 14px
        lineHeight: '1.5rem', // 24px
    };

    const addNewClass = (newClass) => {
        const selectPicker = containerRef.current?.querySelectorAll('.rs-picker-toggle');
        selectPicker.forEach((element) => {
            element.classList.add(newClass);
        });
    }

    const removeClass = (className) => {
        const selectPicker = containerRef.current?.querySelectorAll('.rs-picker-toggle');
        selectPicker.forEach((element) => {
            element.classList.remove(className);
        });
    }

    useEffect(() => {
        if (error) addNewClass('error-field');
        else removeClass('error-field');
    }, [error])

    return (
        <>
            {label && <Label id={id} label={label} />}
            <div ref={containerRef} style={{ position: 'relative' }}>
                <SelectPicker
                    container={() => containerRef.current}
                    preventOverflow={true}
                    menuMaxHeight={300}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`${className} pb-2`}
                    defaultValue={defaultValue}
                    value={value}
                    placement={placement}
                    block
                    {...props}
                />
                {
                    error &&
                    <Text className="w-fit" type="danger">{error}</Text>
                }
            </div>
        </>
        // <div className="block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6 ">
        // </div>
    )
}

Dropdown.propTypes = {
    name: propTypes.string,
    label: propTypes.string,
    id: propTypes.string,
    placement: propTypes.string,
    error: propTypes.string,
    className: propTypes.string,
    placeholder: propTypes.any,
    onChange: propTypes.func,
    value: propTypes.any,
    defaultValue: propTypes.any,
}
