import React from 'react'
import { Navbar, Nav } from 'rsuite';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';

export default function NavToggle(props) {
    const { expand, onClick } = props;

    return (
        <Navbar appearance='subtle'>
            <Nav pullRight>
                <Nav.Item
                    onClick={onClick}
                    style={{ textAlign: 'center' }}
                    icon={expand ? <ArrowLeftLineIcon /> : <ArrowRightLineIcon />}
                />
            </Nav>
        </Navbar>
    );
}
