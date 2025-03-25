// // useData.ts
// import { useEffect, useState } from "react";
// import { AxiosError, CanceledError } from "axios";

// /**
//  * Generic hook that fetches data from a given service
//  * and provides "like" + "getLikes" methods.
//  */
// const useData = <T>(service: any) => {
//   const [data, setData] = useState<T[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   useEffect(() => {
//     setIsLoading(true);
//     const abortController = new AbortController();

//     service
//       .getAll({ signal: abortController.signal })
//       .then((res: any) => {
//         if (res) {
//           setData(res.data as T[]);
//         }
//       })
//       .catch((error: AxiosError) => {
//         if (error instanceof CanceledError) {
//           console.log("Request aborted");
//         } else {
//           setError(error.message);
//         }
//       })
//       .finally(() => setIsLoading(false));

//     return () => abortController.abort();
//   }, [service]);

//   // CHANGED for array-based likes:
//   // The server returns { likes: string[], likeCount: number }.
//   // We'll set item.likes to res.data.likes (the array).
//   const like = (id: string) => {
//     return service
//       .like(id)
//       .then((res: any) => {
//         setData((prevData) =>
//           prevData.map((item) => {
//             const anyItem = item as any;
//             if (anyItem._id === id) {
//               return {
//                 ...anyItem,
//                 likes: res.data.likes, // set the updated array
//               };
//             }
//             return item;
//           })
//         );
//       })
//       .catch((error: any) => {
//         if (error instanceof CanceledError) {
//           console.log(`Like request aborted for item ${id}`);
//         } else {
//           setError(error.message);
//         }
//       });
//   };

//   // Similarly, getLikes now returns an array of user IDs
//   const getLikes = (id: string) => {
//     return service
//       .getLikes(id)
//       .then((res: any) => {
//         // Could do something with res.data.likes...
//         // For example, return it:
//         return res.data.likes || [];
//       })
//       .catch((error: any) => {
//         if (error instanceof CanceledError) {
//           console.log(`Like count request aborted for item ${id}`);
//           return [];
//         }
//         setError(error.message);
//         return [];
//       });
//   };

//   return { data, like, getLikes, error, isLoading };
// };

// export default useData;
import { useState, useEffect } from "react";

const useData = <T>(service: any) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // initially true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    service.abort(); // cancel previous

    const load = async () => {
      const result = await service.getAll();
      if (!isMounted) return;

      if (result?.data) {
        setData(result.data);
      } else {
        setData([]); // fallback if result is null
      }

      setIsLoading(false);
    };

    load();

    return () => {
      isMounted = false;
      service.abort();
    };
  }, [service]);

  const like = async (id: string) => {
    try {
      const res = await service.like(id);
      if (res && res.data) {
        setData((prev) =>
          prev.map((item: any) =>
            item._id === id ? { ...item, likes: res.data.likes } : item
          )
        );
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const getLikes = async (id: string): Promise<string[]> => {
    try {
      const res = await service.getLikes(id);
      return res?.data?.likes || [];
    } catch (err) {
      console.error("getLikes failed", err);
      return [];
    }
  };

  return { data, isLoading, error, like, getLikes };
};

export default useData;
