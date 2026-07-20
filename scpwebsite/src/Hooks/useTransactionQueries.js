import { useQuery } from '@tanstack/react-query';
import { fetchCustomersName, fetchPawnTickets } from '../API/GetListData';

export const useCustomersQuery = (cncode, enabled = true) => {
  return useQuery({
    queryKey: ['customersName', cncode],
    queryFn: () => fetchCustomersName(cncode),
    enabled, // allows you to control initial load
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export const usePawnTicketsQuery = (cncode, enabled = true) => {
  return useQuery({
    queryKey: ['queryPawnTickets', cncode],
    queryFn: () => fetchPawnTickets(cncode),
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};
