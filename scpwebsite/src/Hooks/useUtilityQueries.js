import { useQuery } from '@tanstack/react-query';
import { getLoanItemSetup } from '../API/GetListData';
import { GetDashboardSummary, GetCompanyName } from '../Functions/AxiosFunction';

export const useLoanItemSetup = (catCode, enabled = true) => {
  return useQuery({
    queryKey: ['loan-item-setup', catCode],
    queryFn: () => getLoanItemSetup(catCode),
    enabled: !!catCode,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDashboardSummary = (cnCode) => {
  return useQuery({
    queryKey: ['dashboard-summary', cnCode],
    queryFn: () => GetDashboardSummary(cnCode),
    enabled: !!cnCode,
    staleTime: 1000 * 60, // 1 minute — dashboard stats refresh fairly often
  });
};

export const useBranchName = (cnCode) => {
  return useQuery({
    queryKey: ['branch-name', cnCode],
    queryFn: () => GetCompanyName(cnCode),
    enabled: !!cnCode,
    staleTime: 1000 * 60 * 30, // branch name rarely changes
  });
};






