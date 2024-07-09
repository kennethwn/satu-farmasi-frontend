import React from 'react'
import propTypes from 'prop-types'
import { Panel } from 'rsuite';
import Button from '../Button';
import { IoMdArrowDropleft as ArrowLeftIcon } from "react-icons/io";

export default function ContentLayout(props) {
    const { children, title, type, backpageUrl } = props;

    return (
        <div className='flex flex-col'>
            <Panel 
                bordered
                style={{ borderColor: '#DDDDDD' }}
                className='mb-2'
            >
                <div className='flex flex-row items-center gap-5 max-h-16'>
                    {
                        type === 'child' 
                        ? <Button type='primary' href={backpageUrl} className='w-1'>{<ArrowLeftIcon size={'2em'} />}</Button>
                        : <></>
                    }
                    <span className='text-[32px] leading-9 text-dark font-bold py-[52px]'>{title}</span>
                </div>
            </Panel>
            <Panel bordered className='h-screen'>
                {children}
            </Panel>
        </div>
    )
}

ContentLayout.propTypes = {
    children: propTypes.node,
    title: propTypes.string,
    type: propTypes.string,
    backpageUrl: propTypes.string
}