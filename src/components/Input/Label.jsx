import React from 'react'
import propTypes from 'prop-types'

export default function Label(props) {
    const className = [props.className];
    const {
        id,
        label,
    } = props;

    return (
        <label htmlFor={id} className={`block text-body font-medium leading-6 text-dark ${className}`}>
            {label}
        </label>
    )
}

Label.propTypes = {
    id: propTypes.string.isRequired,
    label: propTypes.string.isRequired
}
