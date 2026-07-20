namespace SCPWEBAPI.FldrModels
{
    public class Models
    {
        public class MdltblUsers
        {
            public string? UserCode { get; set; }
            public string? UserName { get; set; }
            public string? FullName { get; set; }
            public string? PWord { get; set; }
            public string? CNCode { get; set; }
            public string? GroupCode { get; set; }
        }

        public class MdltblCompanyName
        {
            public string? CNCode { get; set; }
            public string? CName { get; set; }
            public string? CAddress { get; set; }
        }

        public class MdlCompany
        {
            public string? Company { get; set; }
            public string? Address { get; set; }
            public string? TIN { get; set; }
        }

        public class MdlSecurityDate
        {
            public DateTime? BeginDate { get; set; }
            public DateTime? EndDate { get; set; }
        }

        public class MdlTDoor
        {
            public int? TableDoor { get; set; }
            public string? Voucher { get; set; }
        }

        public class MdlCompanyName
        {
            public string? CNCode { get; set; }
            public string? CName { get; set; }
            public string? CAddress { get; set; }
        }

        public class MdlEntrySetupEarlyRenewal
        {
            public int? Num { get; set; }
            public int? NumDays { get; set; }
            public double? InterestRate { get; set; }
            public string? CNCode { get; set; }
        }


        public class Payload
        {
            public List<MdlEntrySetupEarlyRenewal>? NewEntries { get; set; }
            public List<MdlEntrySetupEarlyRenewal>? UpdateData { get; set; }
            public List<MdlEntrySetupEarlyRenewal>? DeleteEntries { get; set; }
        }

        public class InterestRate
        {
            public string? RateCode { get; set; }
            public string? CatCode { get; set; }
            public double? Rate { get; set; }
            public string? RateDesc { get; set; }
        }

        public class InterestRateGold
        {
            public string? IntRateCode { get; set; }
            public string? BDays { get; set; }
            public string? EDays { get; set; }
            public double? Perc { get; set; }
            public bool? Partial { get; set; }
        }

        public class SetupPTNumber
        {
            public int? RowNum { get; set; }
            public string? CNCode { get; set; }
            public string? PTNoFrom { get; set; }
            public string? PTNoTo { get; set; }
        }

        public class PTNoSetup
        {
            public List<SetupPTNumber>? NewPTEntries { get; set; }
            public List<SetupPTNumber>? UpdatePTData { get; set; }
        }

        public class SetupRSNumber
        {
            public int? RowNum { get; set; }
            public string? CNCode { get; set; }
            public string? RSPTNoFrom { get; set; }
            public string? RSPTNoTo { get; set; }
        }

        public class RSPTNoSetup
        {
            public List<SetupRSNumber>? NewRSPTEntries { get; set; }
            public List<SetupRSNumber>? UpdateRSPTData { get; set; }
        }

        public class MdlEntrySetupEarlyRedemption
        {
            public int? Num { get; set; }
            public int? NumDays { get; set; }
            public double? InterestRate { get; set; }
            public string? CNCode { get; set; }
        }

        public class EarlyRedemptionPayload
        {
            public List<MdlEntrySetupEarlyRedemption>? EarlyRedemptionNewEntries { get; set; }
            public List<MdlEntrySetupEarlyRedemption>? EarlyRedemptionUpdateData { get; set; }
            public List<MdlEntrySetupEarlyRedemption>? EarlyRedemptionDeleteEntries { get; set; }
        }

        public class MdltblSetupBoxnumber
        {
            public int? Num { get; set; }
            public string? CNCode { get; set; }
            public string? BoxNo { get; set; }
            public bool? Available { get; set; }
        }

        public class CheckDuplicateRequest
        {
            public string strURITable { get; set; }
            public string strURIRow { get; set; }
            public List<DataItem> request { get; set; }
        }


        public class tblBoxNo
        {
            public int? RowNum { get; set; }
            public string? CNCode { get; set; }
            public string? BoxNo { get; set; }
            public bool? Available { get; set; }
        }

        public class DataItem
        {
            public string CNCode { get; set; }
            public string BoxNo { get; set; }
        }

        public class LoanCategory
        {
            public string? CatCode { get; set; }
            public string? CatDesc { get; set; }
        }

        public class CustomerData
        {
            public string? ControlNo { get; set; }
            public string? CustCode { get; set; }
            public string? CustName { get; set; }
            public string? FirstName { get; set; }
            public string? MiddleName { get; set; }
            public string? LastName { get; set; }
            public string? ContactNo { get; set; }
            public string? Address { get; set; }
            public DateTime? Birthdate { get; set; }
            public string? ValidIDNumber { get; set; }
            public string? EmailAddress { get; set; }
            public string? ZipCode { get; set; }
            public string? Active { get; set; }
            public string? CNCode { get; set; }
            public string? Street { get; set; }
            public string? BuildingNo { get; set; }
            public string? Province { get; set; }
            public string? City { get; set; }
            public string? Brgy { get; set; }
        }
        public class CondtionMDL
        {
            public string? ConditionCode { get; set; }
            public string? ConditionDesc { get; set; }
            public string? CatCode { get; set; }
            public string? ConditionDescSub { get; set; }
            public string? CNCode { get; set; }
        }
        public class ColorsMDL
        {
            public string? ColorCode { get; set; }
            public string? ColorDesc { get; set; }
            public string? CatCode { get; set; }
            public string? ColorDescSub { get; set; }
            public string? CNCode { get; set; }
        }
        public class ItemsMDL
        {
            public string? ItemCode { get; set; }
            public string? ItemDesc { get; set; }
            public string? CatCode { get; set; }
            public string? ItemDescSub { get; set; }
            public string? CNCode { get; set; }
        }
        public class CategoryMDL
        {
            public string? CatCode { get; set; }
            public string? CatDesc { get; set; }
        }

        public class DiamondMDL
        {
            public string? DiamondShapeCode { get; set; }
            public string? DiamondShapeDesc { get; set; }
            public string? CatCode { get; set; }
            public string? DiaShapeDescSub { get; set; }
            public string? CNCode { get; set; }
        }
        public class BirthStoneMDL
        {
            public string? BirthStoneCode { get; set; }
            public string? BirthStoneDesc { get; set; }
            public string? CatCode { get; set; }
            public string? BSDescSub { get; set; }
            public string? CNCode { get; set; }

        }

        public class BirthStoneColor
        {
            public string? BSColorCode { get; set; }
            public string? BSColorDesc { get; set; }
            public string? BSColorDescSub { get; set; }
            public string? CNCode { get; set; }
        }
        public class MadeMDL
        {
            public string? MadeCode { get; set; }
            public string? MadeDesc { get; set; }
            public string? MadeDescSub { get; set; }
            public string? CNCode { get; set; }
        }
        public class KaratMDL
        {
            public string? KaratCode { get; set; }
            public string? KaratDesc { get; set; }
            public string? KaratDescSub { get; set; }
            public string? CNCode { get; set; }
        }
        public class BrandMDL
        {
            public string? BrandCode { get; set; }
            public string? BrandDesc { get; set; }
            public string? BrandDescSub { get; set; }
            public string? CNCode { get; set; }

        }

        public class ModelMDL
        {
            public string? ModelCode { get; set; }
            public string? ModelDesc { get; set; }
            public string? ModelDescSub { get; set; }
            public string? CNCode { get; set; }
        }

        public class TitusMDL
        {
            public string? TitusCode { get; set; }
            public string? TitusDesc { get; set; }
            public string? TitusDescSub { get; set; }
            public string? CNCode { get; set; }
        }

        public class ProductModel
        {
            public string? CNCode { get; set; }
            public string? ItemCode { get; set; }
            public string? CatCode { get; set; }
            public string? MadeCode { get; set; }
            public string? ColorCode { get; set; }
            public string? ConditionCode { get; set; }
            public string? BirthStoneCode { get; set; }
            public int? DiamondSize { get; set; }
            public string? DiamondShapeCode { get; set; }
            public int? DiamondPrice { get; set; }
            public string? KaratCode { get; set; }
            public double? Weight { get; set; }
            public string? SerialNo { get; set; }
            public string? PlateNo { get; set; }
            public int? BSPcs { get; set; }
            public int? ProdQty { get; set; }
        }

        public class Main1Model
        {
            public string? Voucher { get; set; }
            public string UserCode { get; set; }
            public DateTime TDate { get; set; }
            public string ControlNo { get; set; }
            public string Remarks { get; set; }
            public double CAmount { get; set; }
            public DateTime DE { get; set; }
            public string CNCode { get; set; }
            public int Term { get; set; }
            public string PawnTicket { get; set; }
            public string BoxNo { get; set; }
            public string Appraiser { get; set; }
            public DateTime VDate { get; set; }
            public DateTime DLGDate { get; set; }
            public bool PartialPayment { get; set; }
        }

        public class Main2ItemModel
        {
            //public string PKProdNumber { get; set; }
            public int RowNum { get; set; }
            public int PIn { get; set; }
            public int POut { get; set; }
            public double IntRate { get; set; }
            public double AppraisedValue { get; set; }
            public double LoanAmount { get; set; }
        }

        public class SaveTransactionModel
        {
            public Main1Model Main1 { get; set; }
            public List<ProductModel> Products { get; set; }
            public List<Main2ItemModel> Main2Items { get; set; }
        }

        public class PartialPayment
        {
            public string? IC { get; set; }
            public string? DocNum { get; set; }
            public DateTime? TDate { get; set; }
            public string? ControlNo { get; set; }
            public string? CNCode { get; set; }
            public string? Reference { get; set; }
            public string? BoxNo { get; set; }
            public string? ItemCode { get; set; }
            public string? MadeCode { get; set; }
            public string? ConditionCode { get; set; }
            public string? ColorCode { get; set; }
            public string? BirthStoneCode { get; set; }
            public string? DiamondSize { get; set; }
            public string? DiamondShapeCode { get; set; }
            public double? DiamondPrice { get; set; }
            public string? KaratCode { get; set;}
            public string? Weight { get; set; }
            public string? SerialNo { get; set; }
            public double? BSWeight { get; set; }
            public double? BSPcs { get; set; }
            public string? CatCode { get; set; }
            public string? CAmount { get; set; }
            public string? PlateNo { get; set; }
            public int? ProdQty { get; set; }
            public  double IntRate { get; set; }    
            //public  string? UserCode { get; set; }

        }

        public class ModelCustNameControlNo
        {
            public string ControlNo { get; set; }
            public string CustName { get; set; }
        }


        public class ModelRenewalFormData
        {
            public string txtStatus { get; set; }
            public string txtAmountDue { get; set; }
            public string txtRenewCAmount { get; set; }
            public string txtBox { get; set; }
            public string txtDueDate { get; set; }
            public string txtAuctionDate { get; set; }
            public string txtRemarksRenew { get; set; }

            public string txtRNPTNum { get; set; }
            public string txtDocNumRenew { get; set; }

            
        }



        public class TermSetupDto
        {
            public int TermExpiration { get; set; } // int32
            public decimal AdditionalInterest { get; set; } // money
            public decimal TermMaturity { get; set; } // money
            public decimal TermAuction { get; set; } // money
        }


        public class LoanItemSetupDto
        {
            public decimal InterestRate { get; set; }
            public bool SerialNoPawnStatus { get; set; }
            public bool MotorNoPawnStatus { get; set; }
            public bool ChasesNoPawnStatus { get; set; }
            public bool ItemCodeStatus { get; set; }
            public bool ColorCodeStatus { get; set; }
            public bool BirthStoneCodeStatus { get; set; }
            public bool ConditionCodeStatus { get; set; }
            public bool DiamondCodeStatus { get; set; }
            public bool KaratCodeStatus { get; set; }
            public bool BSWeightStatus { get; set; }
            public bool BSPieceStatus { get; set; }
            public bool DiamondSizeStatus { get; set; }
            public bool DiamondShapeCodeStatus { get; set; }
            public bool DiamondPriceStatus { get; set; }
        }


    }
}
