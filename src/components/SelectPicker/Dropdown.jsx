import { SelectPicker } from "rsuite";
import propTypes from 'prop-types';
import Label from "../Input/Label";
import Text from "../Text";

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
        borderRadius: '1rem', // 6px
        borderWidth: '1px',
        color: '#111827', // Tailwind's gray-900
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Small shadow
        borderColor: '#333333', // Tailwind's gray-300
        fontSize: '0.875rem', // 14px
        lineHeight: '1.5rem', // 24px
    };

    if (label) className.push('my-2');
    console.log("eror: ", error)

    return (
        <>
            {label && <Label id={id} label={label} />}
            <SelectPicker
                style={styles}
                placeholder={placeholder}
                onChange={onChange}
                className={className}
                defaultValue={defaultValue}
                value={value}
                {...props}
            />
            <div style={{ minHeight: '22px' }}>
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
