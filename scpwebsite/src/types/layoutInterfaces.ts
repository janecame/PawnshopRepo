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

// GET /API/Web/GetCustomer/details row shape (GetCustomerList)
export type CustomerRow = {
  cnCode?: string;
  controlNo: string;
  lastName: string;
  firstName: string;
  middleName: string;
  buildingNo: string;
  street: string;
  brgy: string;
  city: string;
  province: string;
  zipCode: string;
  birthdate: string | null;
  contactNo: string;
  validIDNumber: string;
  emailAddress: string;
  address: string;
  active: string; // "True" | "False"
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

// Entry domain list row shapes (shared by list pages + CustomModal)
export type ColorRow = { colorCode: string; colorDesc: string; catCode?: string; colorDescSub?: string };
export type KaratRow = { karatCode: string; karatDesc: string; karatDescSub?: string };
export type MadeRow = { madeCode: string; madeDesc: string; madeDescSub?: string };
export type ConditionRow = { conditionCode: string; conditionDesc: string; catCode?: string; conditionDescSub?: string };
export type BirthStoneRow = { birthStoneCode: string; birthStoneDesc: string; catCode?: string; bsDescSub?: string };
export type ItemRow = { itemCode: string; itemDesc: string; catCode?: string; itemDescSub?: string; categoryDescription?: string };
export type DiamondShapeRow = { diamondShapeCode: string; diamondShapeDesc: string; catCode?: string; diaShapeDescSub?: string };
export type BirthStoneColorRow = { bsColorCode: string; bsColorDesc: string; catCode?: string; bsColorDescSub?: string };
export type TitusRow = { titusCode: string; titusDesc: string; catCode?: string; titusDescSub?: string };
export type BrandRow = { brandCode: string; brandDesc: string; catCode?: string; brandDescSub?: string };
export type ModelRow = { modelCode: string; modelDesc: string; catCode?: string; modelDescSub?: string };
export type CategoryRow = { catCode: string; catDesc: string };