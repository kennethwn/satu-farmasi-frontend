import React from 'react';

export default function PrescribeIcon(props) {
    const { 
        width = 17, 
        height = 19, 
        fill = 'none', 
        stroke = 'black', 
        strokeWidth = 1.5 
    } = props;

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 22 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
            d="M11 5.44444V7.66667M11 7.66667V9.88889M11 7.66667H8.77778M11 7.66667H13.2222M6.55556 14.3333H7.66667M15.4444 14.3333H11M7.66667 18.7778H14.3333M1 14.3333V9.88889C1 5.69889 1 3.60333 2.30222 2.30222C3.60333 1 5.69889 1 9.88889 1H12.1111C16.3011 1 18.3967 1 19.6978 2.30222C20.4244 3.02778 20.7456 4 20.8867 5.44444M21 9.88889V14.3333C21 18.5233 21 20.6189 19.6978 21.92C18.3967 23.2222 16.3011 23.2222 12.1111 23.2222H9.88889C5.69889 23.2222 3.60333 23.2222 2.30222 21.92C1.57556 21.1944 1.25444 20.2222 1.11333 18.7778"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            />
        </svg>
    )
};