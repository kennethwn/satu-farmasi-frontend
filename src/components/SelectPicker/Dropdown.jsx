import { SelectPicker } from "rsuite";
import propTypes from 'prop-types';
import Label from "../Input/Label";
import Text from "../Text";
import { useRef } from "react";

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

    if (label) classNames.push('my-2');

    return (
        <>
            {label && <Label id={id} label={label} />}
            <div ref={containerRef} style={{ position: 'relative' }}>
                <SelectPicker
                    container={() => containerRef.current}
                    preventOverflow={false}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={className}
                    defaultValue={defaultValue}
                    value={value}
                    placement={placement}
                    {...props}
                />
            </div>
            {
                error &&
                    <div style={{ minHeight: '22px' }}>
                            <Text type="danger">{error}</Text>
                    </div>
            }
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
    placeholder: propTypes.string,
    onChange: propTypes.func,
    value: propTypes.any,
    defaultValue: propTypes.any,
}
