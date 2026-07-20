import { useQuery } from '@tanstack/react-query';
import {  GetUsers, GetObjects, GetGroups, GetCompanyBranches, getGroupPermissions } from '../API/GetListData';


export const useUsersQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['usersList'],
    queryFn: GetUsers,
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export const useObjectsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['objectsList'],
    queryFn: GetObjects,
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export const useGroupsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['groupsList'],
    queryFn: GetGroups,
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};



export const useCompanyBranches = (enabled = true) => {
  return useQuery({
    queryKey: ['companyBranches'],
    queryFn: GetCompanyBranches,
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};


export const useGroupPermissions = (group, enabled = true) => {
  return useQuery({
    queryKey: ['groupPermissions', group],
    queryFn: () => getGroupPermissions(group),
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};


