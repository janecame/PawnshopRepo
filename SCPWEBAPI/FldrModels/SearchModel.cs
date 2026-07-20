namespace SCPWEBAPI.FldrModels
{
    public class SearchModel
    {
        public class SearchReadyForAuction
        {
            public string CustName { get; set; }
            public string PawnTicketNew { get; set; }
            public string BoxNo { get; set; }
            public string DLGDate { get; set; } // Or DateTime
            public string ItemDesc { get; set; }
            public string Weight { get; set; }
            public string KaratDesc { get; set; }
            public decimal CAmount { get; set; }
        }


        public class GetRequestTransaction
        {
            public bool VarPTNo { get; set; }
            public string? StrPTNo { get; set; }
            public string? StrControlNo { get; set; }
            public string? StrVoucher { get; set; }
        }


        public class PawnDetailsDto
        {
            public DateTime dlg { get; set; }
            public DateTime expDate { get; set; }
            public DateTime OriginalPawnDate { get; set; }
            public decimal principalAmount { get; set; }
            public decimal interestAmount { get; set; }
            public string appraiser { get; set; }
            public string remarks { get; set; }
            public string status { get; set; }
        }



        public class ItemsDto
        {
            public string PawnTicket { get; set; }
            public string ItemCode { get; set; }
            public string MadeCode { get; set; }
            public string KaratCode { get; set; }
            public decimal? Weight { get; set; }
            public decimal? intrate { get; set; }
            public string PKProdNumber { get; set; }
            public string IC { get; set; }
            public decimal? CAmount { get; set; }
            public string ProdNumber { get; set; }
            public string ColorCode { get; set; }
            public string ConditionCode { get; set; }
            public string BirthStoneCode { get; set; }
            public string DiamondSize { get; set; }
            public string DiamondShapeCode { get; set; }
            public decimal? DiamondPrice { get; set; }
            public string SerialNo { get; set; }
            public string ChasisNo { get; set; }
            public string MotorNo { get; set; }

            public DateTime? MDate { get; set; }
            public DateTime? EDate { get; set; }
            public DateTime? TDate { get; set; }
            public DateTime? DLGDate { get; set; }

            public int? BSPcs { get; set; }
            public decimal? BSWeight { get; set; }
            public int? RowNum { get; set; }
            public string BoxNo { get; set; }
        }


        public class SearchEditModel
        {
            // Keys (WHERE clause for tblMain1) — not editable
            public string IC { get; set; }
            public string CNCode { get; set; }

            // Header fields (tblMain1)
            public string Appraiser { get; set; }
            public string Remarks { get; set; }
            public decimal? CAmount { get; set; }
            public DateTime? DLGDate { get; set; }
            public DateTime? EDate { get; set; }
            public string BoxNo { get; set; }

            // Item key (WHERE clause for tblStocks) — not editable
            public string PKProdNumber { get; set; }

            // Item fields (tblStocks)
            public string ItemCode { get; set; }
            public string MadeCode { get; set; }
            public string KaratCode { get; set; }
            public string ColorCode { get; set; }
            public string ConditionCode { get; set; }
            public string BirthStoneCode { get; set; }
            public string DiamondShapeCode { get; set; }
            public decimal? DiamondSize { get; set; }
            public decimal? DiamondPrice { get; set; }
            public decimal? Weight { get; set; }
            public decimal? BSWeight { get; set; }
            public decimal? BSPcs { get; set; }
            public string SerialNo { get; set; }
            public string MotorNo { get; set; }
            public string ChasisNo { get; set; }
        }


    }
}
