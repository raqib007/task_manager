import React, {createContext} from "react";
import useProvideAuth from "../custom-hooks/useProvideAuth";

const AuthContext = createContext();

function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext,ProvideAuth};
