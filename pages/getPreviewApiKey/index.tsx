import { FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
    useEffect(() => {
        webAuth.authorize({ redirectUri: `https://ficto-surgical-git-devrel-914-dynamic-projects-devrel-kontentai.vercel.app//callback` });
    }, [])

    return null;
}

export default GetPreviewApiKey