import { Modal } from "rsuite";
import Button from "../Button";
import propTypes from 'prop-types';

// Check another modal props -> https://rsuitejs.com/components/modal/#props
export default function Toaster({
    title,
    body,
    type,
    btnText = 'Lanjutkan',
    onClick,
    isLoading,
    ...props
}) {

    const renderTitle = () => {
        switch (type) {
            case 'success':
                return <span className="text-center w-full text-success">Berhasil</span>
            case 'warning':
                return <span className="text-center w-full text-danger">Peringatan!</span>
            default:
                return <span className="text-center w-full text-dark">{title}</span>
        }
    }

    const renderButton = () => {
        switch (type) {
            case 'success':
                return <Button>{btnText}</Button>
            case 'warning':
                return (
                    <div className="w-full flex flex-row items-center gap-4 justify-between">
                        <Button className="w-full" onClick={() => props.onClose()}>Batalkan</Button>
                        <Button className="w-full" isLoading={isLoading} appearance="danger" onClick={() => onClick()}>{btnText}</Button>
                    </div>
                )
            default:
                return <Button className="w-full">Lanjutkan</Button>
        }
    }

    return (
        <Modal 
            size="xs" 
            {...props}
        >
            <Modal.Header className="w-full">
                <Modal.Title className="w-full h-fit">{renderTitle()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="font-medium text-dark">{body}</p>
            </Modal.Body>
            <Modal.Footer className="w-full items-center justify-center">
                {renderButton()}
            </Modal.Footer>
        </Modal>
    )
}

Toaster.propTypes = {
    title: propTypes.string,
    body: propTypes.string,
    type: propTypes.string,
    btnText: propTypes.string,
    isLoading: propTypes.bool,
    onClick: propTypes.func,
}