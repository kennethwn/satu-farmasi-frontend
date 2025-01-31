import React, { useState } from 'react'
import propTypes from 'prop-types'
import { Panel } from 'rsuite';
import Button from '../Button';
import { IoMdArrowDropleft as ArrowLeftIcon } from "react-icons/io";
import { useRouter } from 'next/router';

export default function ContentLayout(props) {
    const { children, header, title, table, type, backpageUrl } = props;
    const router = useRouter();

    return (
        <div className='flex flex-col h-full'>
            <Panel 
                bordered
                style={{ borderColor: '#DDDDDD' }}
                className='mb-2 pb-4'
            >
                <div className='flex flex-row items-center gap-5 max-h-16'>
                    {
                        type === 'child' 
                        ? <Button appearance='primary' onClick={() => router.push(backpageUrl)} className='w-1'>{<ArrowLeftIcon size={'24px'} />}</Button>
                        : <></>
                    }
                    <span className='text-[32px] leading-9 text-dark font-bold py-[52px]'>{title}</span>
                </div>
            </Panel>
            <Panel 
                bordered 
                className='gap-2 overflow-auto h-full'
                header={header}
                // bodyFill={table}
            >
                {children}
            </Panel>
        </div>
    )
}

ContentLayout.propTypes = {
    header: propTypes.node,
    children: propTypes.node,
    title: propTypes.string,
    table: propTypes.bool,
    type: propTypes.string,
    backpageUrl: propTypes.string
}