import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { usePocketBase } from '@/pb/pb';
import { useInView } from 'react-intersection-observer';
import { debounce } from 'lodash';

export interface ListOptions {
  expand?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalPages: number;
  nextPage?: number;
}

/**
 * React Query bilan cheksiz ro'yxatni amalga oshirish uchun hook.
 *
 * @example
 * import { useInfinityScroll } from '@/hooks/useInfinityScroll';
 *
 * const { data, isLoading, fetchNextPage, hasNextPage, searchText, setSearchText, ref } = useInfinityScroll('products', {
 *   expand: 'category',
 * });
 *
 * return (
 *   <div>
 *     <input
 *       type="text"
 *       value={searchText}
 *       onChange={(e) => setSearchText(e.target.value)}
 *       placeholder="Search..."
 *     />
 *     <ul>
 *       {data?.pages.map((group, i) => (
 *         <React.Fragment key={i}>
 *           {group.items.map((item) => (
 *             <li key={item.id}>{item.name}</li>
 *           ))}
 *         </React.Fragment>
 *       ))}
 *     </ul>
 *     <div ref={ref}>{hasNextPage && <button onClick={fetchNextPage}>Load more</button>}</div>
 *     {isLoading && <div>Loading...</div>}
 *   </div>
 * );
 * @param collectionName - pocketbase kolleksiyasi nomi
 * @param options - pocketbase getList uchun options obyekti
 * @returns
 * - data: PaginatedResponse<T>[] - ro'yxatni saqlash uchun array
 * - isLoading: boolean - ro'yxatni yuklash jarayoni davom etayotganligini ko'rsatadi
 * - fetchNextPage: () => Promise<void> - keyingi sahifani yuklash uchun funksiya
 * - hasNextPage: boolean - keyingi sahifa mavjudligini ko'rsatadi
 * - searchText: string - qidiruv so'zi
 * - setSearchText: (value: string) => void - qidiruv so'zini yangilash uchun funksiya
 * - ref: React.RefObject<HTMLDivElement> - scrollni tekshirish uchun ref obyekti
 */
export function useInfinityScroll<T>(
  collectionName: string,
  options?: Partial<ListOptions>
) {
  const [searchText, setSearchText] = useState<string>('');
  const pb = usePocketBase();

  const fetchData = async (
    currentPage: number
  ): Promise<PaginatedResponse<T>> => {
    try {
      const response = await pb
        .collection(collectionName)
        .getList<T>(currentPage, 500, {
          ...options,
          filter: searchText ? `name~"${searchText}"` : undefined,
          expand: options?.expand
        });
      return {
        items: response.items,
        page: response.page,
        perPage: response.perPage,
        totalPages: response.totalPages,
        nextPage:
          response.page < response.totalPages ? response.page + 1 : undefined
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch ${collectionName}: ${(error as Error).message}`
      );
    }
  };

  // Debounced searchText setter
  const debouncedSearchText = debounce((value: string) => {
    setSearchText(value);
  }, 500);

  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [collectionName, 'infinity', searchText],
    queryFn: ({ pageParam = 1 }) => fetchData(pageParam as number),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    searchText,
    setSearchText: debouncedSearchText,
    ref
  };
}
