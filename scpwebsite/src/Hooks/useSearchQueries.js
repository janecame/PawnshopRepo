import { useQuery, useMutation } from '@tanstack/react-query';
import { getSearchReadyForAuction, getSearchPawntickeVoucher, updateSearchTransaction } from '../API/GetListData';

export const useSearchReadyForAuction = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['search-ready-for-auction', cnCode],
    queryFn: () => getSearchReadyForAuction(cnCode),
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};


export const useSearchPawntickeVoucher = (cnCode, voucher, enabled = true) => {
  return useQuery({
    queryKey: ['search-pawnticket-voucher', cnCode, voucher],
    queryFn: () => getSearchPawntickeVoucher(cnCode, voucher),
    enabled:  !!cnCode && !!voucher && enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};


export const useUpdateSearchTransaction = () => {
  return useMutation({
    mutationFn: (payload) => updateSearchTransaction(payload),
  });
};




