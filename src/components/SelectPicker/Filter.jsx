import { useEffect, useRef, useState } from "react";
import { SelectPicker } from "rsuite";
import propTypes from 'prop-types';

export default function Filter({ 
    selectedFilter = '', 
    setSelectedFilter = () => {}, 
    ...props 
}) {
    const [width, setWidth] = useState('180px');
    const textRef = useRef(null);

    useEffect(() => {
        if (selectedFilter) {
            const textWidth = textRef.current ? textRef.current.offsetWidth : 180;
            setWidth(`${textWidth}px`);
        } else {
        setWidth('180px');
        }
    }, [selectedFilter]);

    return (
        <SelectPicker
            {...props}
            style={{ width }}
            value={selectedFilter}
            onChange={(value) => setSelectedFilter(value)}
        />
    )
}

Filter.propTypes = {
    selectedFilter: propTypes.string,
    setSelectedFilter: propTypes.func
}