// useData.ts
import { useEffect, useState } from "react";
import { AxiosError, CanceledError } from "axios";

/**
 * Generic hook that fetches data from a given service
 * and provides "like" + "getLikes" methods.
 */
const useData = <T>(service: any) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();

    service
      .getAll({ signal: abortController.signal })
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

  // CHANGED for array-based likes:
  // The server returns { likes: string[], likeCount: number }.
  // We'll set item.likes to res.data.likes (the array).
  const like = (id: string) => {
    return service
      .like(id)
      .then((res: any) => {
        setData((prevData) =>
          prevData.map((item) => {
            const anyItem = item as any;
            if (anyItem._id === id) {
              return {
                ...anyItem,
                likes: res.data.likes, // set the updated array
              };
            }
            return item;
          })
        );
      })
      .catch((error: any) => {
        if (error instanceof CanceledError) {
          console.log(`Like request aborted for item ${id}`);
        } else {
          setError(error.message);
        }
      });
  };

  // Similarly, getLikes now returns an array of user IDs
  const getLikes = (id: string) => {
    return service
      .getLikes(id)
      .then((res: any) => {
        // Could do something with res.data.likes...
        // For example, return it:
        return res.data.likes || [];
      })
      .catch((error: any) => {
        if (error instanceof CanceledError) {
          console.log(`Like count request aborted for item ${id}`);
          return [];
        }
        setError(error.message);
        return [];
      });
  };

  return { data, like, getLikes, error, isLoading };
};

export default useData;
