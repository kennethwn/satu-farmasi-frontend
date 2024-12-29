import { Modal } from "rsuite";
import Button from "../Button";
import propTypes from 'prop-types';

// Check another modal props -> https://rsuitejs.com/components/modal/#props
export default function Toaster({
    size = "xs",
    title,
    body,
    type,
    btnText = 'Lanjutkan',
    onClick,
    isLoading,
    showBtn = true,
    btnAppearance = 'danger',
    ...props
}) {

    const renderTitle = () => {
        switch (type) {
            case 'success':
                return <span className="text-center w-full text-success font-bold">Berhasil</span>
            case 'warning':
                return <p className="text-center w-full text-danger font-bold">Peringatan!</p>
            default:
                return <span className="text-center w-full text-dark font-bold">{title}</span>
        }
    }

    const renderButton = () => {
        switch (type) {
            case 'success':
                return <Button>{btnText}</Button>
            case 'warning':
                return (
                    <div className="w-full flex flex-row items-center gap-4 justify-between">
                        <Button className="w-full" onClick={() => props.onClose()} isDisabled={isLoading} appearance="subtle">Batalkan</Button>
                        <Button className="w-full" isLoading={isLoading} appearance={btnAppearance} onClick={() => onClick()} isDisabled={isLoading}>{btnText}</Button>
                    </div>
                )
            case 'confirm':
                return (
                    <div className="w-full flex flex-row items-center gap-4 justify-between">
                        <Button className="w-full" onClick={() => props.onClose()} isDisabled={isLoading} appearance="subtle">Batalkan</Button>
                        <Button className="w-full" isLoading={isLoading} appearance="primary" onClick={() => onClick()} isDisabled={isLoading}>{btnText}</Button>
                    </div>
                )
            default:
                return <Button className="w-full" onClick={() => onClick()} isDisabled={isLoading}>{btnText}</Button>
        }
    }

    return (
        <Modal 
            size={size}
            {...props}
        >
            <Modal.Header className="w-full">
                <Modal.Title className="w-full h-fit">{renderTitle()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="font-medium text-dark text-center">{body}</p>
            </Modal.Body>
            {showBtn &&
                <Modal.Footer className="w-full items-center justify-center">
                    {renderButton()}
                </Modal.Footer>
            }
        </Modal>
    )
}

Toaster.propTypes = {
    title: propTypes.string,
    body: propTypes.object,
    type: propTypes.string,
    btnText: propTypes.string,
    isLoading: propTypes.bool,
    onClick: propTypes.func,
}
