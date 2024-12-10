import PropTypes from 'prop-types';

export default function Text(props) {
    const { type, className, children } = props;
    switch (type) {
        case "heading_3":
            return <p className='text-heading_3 text-dark font-semibold'>{children}</p>
        case "title":
            return <p className='text-title text-dark font-semibold'>{children}</p>
        case "body":
            return <p className={`text-body text-dark font-normal ${className}`}>{children}</p>
        case "danger":
            return <p className='text-sm text-danger font-normal'>{children}</p>
    }
}

Text.propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};
