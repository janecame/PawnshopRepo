import { useQuery } from '@tanstack/react-query';
import { GetListCategory, GetBirthStoneColor, GetListTitus, GetListBrand, GetListModel } from "../API/GetListData";


import {
    GetDiamondShape,
    GetItemList,
    GetColorList,
    GetConditionList,
    GetKaratList,
    GetBirthstoneList,
    GetMadeList,
    GetCustomerList,
    GetTermSetup
} from "../Functions/AxiosFunction";


export const useDiamondShape = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['diamondShapes', cnCode],
    queryFn: () => GetDiamondShape(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60,
  });
};



export const useListCategory = (enabled = true) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: GetListCategory,
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};



export const useColors = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['colors', cnCode],
    queryFn: () => GetColorList(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};


export const useItems = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['items', cnCode],
    queryFn: () => GetItemList(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};



export const useConditions = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['conditions', cnCode],
    queryFn: () => GetConditionList(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};


export const useBirthStone = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['birthstone', cnCode],
    queryFn: () => GetBirthstoneList(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};


export const useKarats = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['karats', cnCode],
    queryFn: () => GetKaratList(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};


export const useMade = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['made', cnCode],
    queryFn: () => GetMadeList(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useBirthStoneColor = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['birthstoneColor', cnCode],
    queryFn: () => GetBirthStoneColor(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};


export const useTitus = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['titus', cnCode],
    queryFn: () => GetListTitus(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};



export const useBrands = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['brands', cnCode],
    queryFn: () => GetListBrand(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};



export const useModels = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['models', cnCode],
    queryFn: () => GetListModel(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};



export const useCustomers = (cnCode, enabled = true) => {
  return useQuery({
    queryKey: ['customers', cnCode],
    queryFn: () => GetCustomerList(cnCode),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useTermSetup = (enabled = true) => {
  return useQuery({
    queryKey: ['term-setup'],
    queryFn: GetTermSetup,
    enabled
  });
};

/*
export const useSilverRange = (principalAmount, enabled = true) => {
  return useQuery({
    queryKey: ['silver-range', principalAmount],
    queryFn: () => GetSilverRange(principalAmount),
    enabled,
  });
};
*/










