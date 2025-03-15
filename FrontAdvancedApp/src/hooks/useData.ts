import { useEffect, useState } from "react";
import { AxiosError, CanceledError } from "axios";

const useData = <T>(service: any) => {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        const abortController = new AbortController();

        service.getAll({ signal: abortController.signal }) 
            .then((res: any) => {
                if (res) {
                    setData(res.data as T[]);
                }
            })
            .catch((error: AxiosError) => {
                if (error instanceof CanceledError) {
                    console.log("Request aborted");
                } else {
                    setError(error.message);
                }
            })
            .finally(() => setIsLoading(false));

        return () => abortController.abort(); 
    }, [service]);

    // ✅ Like Function (Fix)
    const like = (id: string) => {
        return service.like(id)
            .then((res: any) => {
                setData(data.map(item =>
                    (item as any)._id === id ? { ...item, likes: res.data.likes } : item
                ));
            })
            .catch((error: any) => {
                if (error instanceof CanceledError) {
                    console.log(`Like request aborted for post ${id}`);
                } else {
                    setError(error.message);
                }
            });
    };

    // ✅ Get Likes Function (Fix)
    const getLikes = (id: string) => {
        return service.getLikes(id)
            .then((res: any) => {
                return typeof res.data === "object" && "likes" in res.data ? res.data.likes : res.data; 
            })
            .catch((error: any) => {
                if (error instanceof CanceledError) {
                    console.log(`Like count request aborted for post ${id}`);
                    return 0;
                }
                setError(error.message);
                return 0;
            });
    };

    return { data, like, getLikes, error, isLoading };
};

export default useData;
