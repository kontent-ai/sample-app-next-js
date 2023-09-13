import { FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
    useEffect(() => {
        webAuth.authorize({ redirectUri: `http://localhost:3000/callback` });
    }, [])

    return null;
}

export default GetPreviewApiKey