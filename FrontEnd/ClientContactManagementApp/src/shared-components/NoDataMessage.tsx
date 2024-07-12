import './NoDataMessage.css';

interface IProps {
    message:string;
}

const NoDataMessage = ({message}:IProps) => {
    return (
        <div className="no-data-message">
            <div className="no-data-icon">🚫</div>
            <div className="no-data-text">{message}</div>
        </div>
    );
};

export default NoDataMessage;
