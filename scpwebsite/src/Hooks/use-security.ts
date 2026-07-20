import { useQuery } from "@tanstack/react-query";
import {
  getGroupPermissions,
  GetGroups,
  GetObjects,
  GetUsers,
} from "../API/GetListData";
import type { Group, User } from "@/types/securityInterfaces";

export const usePermissions = (groupCode?: string, enabled: boolean = true) =>
  useQuery<string[], Error>({
    queryKey: ["groupPermissions", groupCode],
    queryFn: () => getGroupPermissions(groupCode!),
    enabled: enabled && !!groupCode,
    staleTime: 0,
    refetchOnMount: "always",
    gcTime: 1000 * 60,
  });

export const useGroups = (cnCode?: string, enabled: boolean = true) =>
  useQuery<Group[], Error>({
    queryKey: ["groups", cnCode],
    queryFn: GetGroups,
    enabled,
    staleTime: 1000 * 60 * 5,
  });

export const useObjects = (enabled: boolean = true) =>
  useQuery<{ objectCode: string; objectName: string }[], Error>({
    queryKey: ["objects"],
    queryFn: GetObjects,
    enabled,
    staleTime: 1000 * 60 * 5,
  });

export const useUsers = (cnCode?: string, enabled: boolean = true) =>
  useQuery<User[], Error>({
    queryKey: ["users", cnCode],
    queryFn: GetUsers,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
