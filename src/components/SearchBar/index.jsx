import { Input, InputGroup } from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import propTypes from 'prop-types';
import React from "react";

export default function SearchBar({ 
    className,
    placeholder,
    onChange,
    ...props 
}) {

    const styles = {
        width: '100%',
        borderWidth: '1px',     
        color: '#DDDDDD',       
        borderColor: '#DDDDDD', 
        placeholder: {
          color: '#9ca3af'     
        },
        fontSize: '1rem',      
        lineHeight: '1.5rem'   
    };
      

    return (
        <div className={className}>
            <InputGroup style={styles} {...props} inside>
                <InputGroup.Addon>
                    <SearchIcon />
                </InputGroup.Addon>
                <Input
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </InputGroup>
        </div>
    )
}

SearchBar.propTypes = {
    placeholder: propTypes.string,
    className: propTypes.string,
    onChange: propTypes.func
}