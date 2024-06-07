// Assuming 'baseApiURL' is exported from '../App.jsx'
import { baseApiURL } from "../App.jsx";

export default function Login() {
    const handleOAuth = () => {
        window.open(`${baseApiURL}/v1/auth/google`, "_self");
    };

    return (
        <div>
            <button onClick={handleOAuth}>
                Login with Google
            </button>
        </div>
    );
}
