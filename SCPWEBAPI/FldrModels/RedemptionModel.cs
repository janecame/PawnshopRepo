
namespace SCPWEBAPI.FldrModels
{
    public class RedemptionModel
    {   

        public class RedemptionMainModel
        {
            public VDateModel vDate { get; set; }
            public TicketDetails ticketDetails { get; set; }
            public DetailsModel detailsInfo { get; set; }
            //public DetailsModel dateValidate { get; set; }

        }


        public class DetailsModel
        {
            public string txtRenewCAmount { get; set; }
            public string txtBox { get; set; }
            public string txtDueDate { get; set; }
            public string txtAuctionDate { get; set; }
            public string txtRemarksRenew { get; set; }
            public string txtForDiscount { get; set; } 
            public string lblMonthIntAmt { get; set; }
            public string txtPawnDate { get; set; }
            public string txtNoMonth { get; set; }
            
            public string txtAmountDue { get; set; }
            
            public List<Rows> rows { get; set; }
            
        }


        public class Rows
        {
            

            public string Row1 { get; set; }
            public string Row2 { get; set; }
            public string Row3 { get; set; }
            public string Row4 { get; set; }
            public string Row5 { get; set; }
            public string Row6 { get; set; }
            public string Row7 { get; set; }
            public string Row8 { get; set; }
            public string Row9 { get; set; }

        }

        public class Items
        {
            

            public string Row1 { get; set; }
            public string Row2 { get; set; }
            public string Row3 { get; set; }
            public string Row4 { get; set; }
            public string Row5 { get; set; }
            public string Row6 { get; set; }
            public string Row7 { get; set; }
            public string Row8 { get; set; }
            public string Row9 { get; set; }

        }

        public class RedemptionOnLoad
        {
            public string txtDocNumRenew { get; set; }
            public string txtReference { get; set; }
            public string txtTDate { get; set; }

        }


        public class TicketDetails
        {
            public string txtOldPawnTicket { get; set; }
            public string dblPawnTicket { get; set; }
            public string Voucher { get; set; }
            public string txtStatus { get; set; }
            public string pawner { get; set; }
        }

        public class SearhDetails
        {
            public string pawnTicket { get; set; }
            public string cnCode { get; set; }
        }

        public class VDateModel
        {
            public string txtLatestPawnDate { get; set; }
            public string txtPawnDate { get; set; }
            public DateTime pawnDateCal { get; set; }

        }



        public class RedemptionSaveModel{
            public Main1 main1 { get; set; }
            public Main2 main2 { get; set; }
            public Main3 main3 { get; set; }
        }


        public class Main1
        {
            public string IC { get; set; }
            public string UserCode { get; set; }
            public string DocNum { get; set; }
            public string TDate { get; set; }
            public string Reference { get; set; }
            public string ControlNo { get; set; }
            public string Remarks { get; set; }
            public decimal CAmount { get; set; }
            public string CNCode { get; set; }
            public string PawnTicket { get; set; }
            public string BoxNo { get; set; }
        }

        public class Main2
        {
            public string IC { get; set; }
            public List<Items> items { get; set; }
        }

        public class Main3
        {
            public string IC { get; set; }
            public string PaymentAmt { get; set; }
            public string PenaltyFee { get; set; }
            public string ServiceFee { get; set; }
            public string Discount { get; set; }
            public string Discount1 { get; set; }

            
        }


        

        public class TDateValidationModel
        {
            public string txtTDate { get; set; }
            public string txtRenewCAmount { get; set; }
            public string txtLatestPawnDate { get; set; }
            public string strPawnTicket { get; set; }
            public string strCNCode { get; set; }
            public string lblMonthIntAmt { get; set; }
            public DateTime txtPawnDate { get; set; }

            
            public List<Items> items { get; set; }
        }


        public class TDateValidatedModel
        {
            public string txtForDiscount { get; set; }
            public string txtAmountDue { get; set; }
            public string txtRedempDiscount { get; set; }
            public List<Items> items { get; set; }
        }



        
        


    }
}
