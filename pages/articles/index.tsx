import { useRouter } from "next/router";
import { useEffect } from "react";

const Articles: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/articles/category/all')
    }, [router])

    return <></>
}

export default Articles;