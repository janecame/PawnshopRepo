import type { ReactNode } from "react";

export interface RouteConfig {
  type?: "collapse";
  name: string;
  key: string;
  route: string;
  permission?: string;
  layout: string;
  icon: ReactNode;
  component?: React.ReactNode;
  noCollapse?: boolean;
  noDisplay?: boolean;
  childs?: RouteConfig[];
}

export type SelectOption = {
  value: string;
  label: string;
};

export type ModelWarehouse = {
  whCode: number;
  whDesc: string;
};

export type ModelMember = {
  memberCode: number;
  memberName: string;
  contactNo: number;
  classCode: string;
};

export type ModelAsset = {
  assetCode: string;
  assetID: string;
  assetDesc: string;
  assetRemarks: string;
  unitMeasure?: string;
};

// Shared layout for Entry Asset (list + modals)
export type EntryAssetRow = {
  code: string;
  id: string;
  description: string;
  remark: string;
  unitMeasure: string;
  brand: string;
  model: string;
  serialNo: string;
  dateAcquired: string;
  categoryCode: string;
  categoryDescription?: string;
};

export type AssetRow = {
  id: number;
  assetCode: string;
  whCode: string;
  qtyIn: string;
};

export type OutslipRow = {
  id: number;
  assets: string;
  quantity: string;
  selectedAsset: SelectOption | null;
  balance?: number;
  isBalanceLoading?: boolean;
};

export type InserttblMain1Payload = {
  IC: string;
  DocNum: string;
  Voucher: string;
  UserCode: string;
  TDate: string;
  MemberCode: string;
  Reference: string;
  Remarks: string;
  ModelSubtblMain2: {
    AssetCode: string;
    WHCode: string;
    QtyIn: number;
    QtyOut: number;
    DestWHCode: string | null;
  }[];
};

export type OutslipDetailRow = {
  RowNum: number;
  AssetCode: string;
  RequestedQty: number;
  IssuedQty: number;
};

export type InserttblOutSlip1Payload = {
  Voucher: string;
  DocNum: string;
  UserCode: string;
  WHCode: string;
  TDate: string;
  MemberCode: string;
  Reference: string;
  Remarks: string;
  PostedIssuance: boolean;
  ModelSubtblOutSlip2: OutslipDetailRow[];
};