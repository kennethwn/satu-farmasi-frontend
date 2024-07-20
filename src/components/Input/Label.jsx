import React from 'react'
import propTypes from 'prop-types'

export default function Label(props) {
    const className = [props.className];
    const {
        text,
        htmlFor
    } = props;


    return (
        <label htmlFor={htmlFor}>
            {text}
        </label>
    )
}

// Input.defaultProps = {
//     type: 'text',
//     disabled: false,
//     placeholder: 'field name',
// }

// Input.propTypes = {
//     type: propTypes.oneOf(['text', 'number', 'email', 'password', 'tel', 'date', 'checkbox', "radio"]),
//     id: propTypes.string,
//     name: propTypes.string,
//     onChange: propTypes.func,
//     disabled: propTypes.bool,
//     placeholder: propTypes.string,
//     value: propTypes.string,
//     className: propTypes.string,
//     checked: propTypes.bool,
//     register: propTypes.func
// }