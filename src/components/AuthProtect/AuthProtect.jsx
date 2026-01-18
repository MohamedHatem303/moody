import { Navigate } from "react-router-dom";

export default function AuthProtect({children}) {
    if(localStorage.getItem("token")) {
        return <Navigate to="/Home" replace />
    }
    return children;
}
