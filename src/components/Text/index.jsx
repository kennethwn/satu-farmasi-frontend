import PropTypes from 'prop-types';

export default function Text(props) {
    const { type, children } = props;
    switch (type) {
        case "title":
            return <p className='text-title text-dark font-semibold'>{children}</p>
        case "body":
            return <p className='text-sm text-dark font-normal'>{children}</p>
        case "danger":
            return (
                <ul className='list-none'>
                    <li className='text-sm text-danger font-semibold'>{children}</li>
                </ul>
            )
    }
}

Text.propTypes = {
    type: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};