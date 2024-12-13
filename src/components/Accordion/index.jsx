import PropTypes from "prop-types";
import { Accordion } from "rsuite";

export default function Input(props, child) {
    const className = [props.className];
    const {
        header,
        children,
    } = props;

    className.push("border-gray-300 w-full")

    return (
        <Accordion>
            <Accordion.Panel header={header} defaultExpanded>
                {children}
            </Accordion.Panel>
        </Accordion>

    )

}

Input.propTypes = {
    className: PropTypes.string,
}
