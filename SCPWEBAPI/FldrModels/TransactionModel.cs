
namespace SCPWEBAPI.FldrModels
{
    public class TransactionModel
    {   

        public class RenewalMainModel
        {
            public VDateModel vDate { get; set; }
            public TicketDetails ticketDetails { get; set; }
            public DetailsModel detailsInfo { get; set; }
            public DetailsModel dateValidate { get; set; }

        }


        public class RenewalOnLoad
        {
            public string txtTDate { get; set; }
            public string txtReference { get; set; }
            public string txtRNPTNum { get; set; }
            public string txtDocNumRenew { get; set; }  // Missing property added
            public int txtServiceFee { get; set; }  // Missing property added

        }


        //public customerPawnTikcetsList customersPawnTikcets { get; set; }


        public class SearhDetails
        {
            public string pawnTicket { get; set; }
            public string cnCode { get; set; }
        }

        public class PTAutoNumRequest
        {
            public string CNCode { get; set; }
        }


        public class TicketDetails
        {
            public string txtOldPawnTicket { get; set; }
            public string dblPawnTicket { get; set; }
            public string Voucher { get; set; }
            public string txtStatus { get; set; }
            public string pawner { get; set; }
        }

        public class VDateModel
        {
            public string txtLatestPawnDate { get; set; }
            public string txtPawnDate { get; set; }
            public DateTime pawnDateCal { get; set; }

        }

        public class DetailsModel
        {
            public string txtRenewCAmount { get; set; }
            public string txtBox { get; set; }
            public string txtDueDate { get; set; }
            public string txtAuctionDate { get; set; }
            public string txtRemarksRenew { get; set; }
            public string txtInterestDue { get; set; }
            public string txtForDiscount { get; set; } 
            public string txtRSDiscount { get; set; }
            public string lblMonthIntAmt { get; set; }
            public string txtRemainingBal { get; set; }

            public string txtNewPawnDate { get; set; }
            public string txtServiceFee { get; set; }   
            public string txtPenalty { get; set; }
            public string txtDiscount { get; set; }
            public int noOfMonths { get; set; }

            public List<Rows> rows { get; set; }
            
        }

        public class DetailsDateValidateModel
        {
            
            public string txtInterestDue { get; set; }
            public string txtForDiscount { get; set; } 
            public string txtRSDiscount { get; set; }
            public List<Rows> rows { get; set; }
            
        }


        



        public class ValidateRequest
        {
            public string TxtPawnDate { get; set; }
            public string TxtAuctionDate { get; set; }
            public List<Rows> Rows { get; set; }
        }


        public class ValidateRequest2
        {
            public string txtInterestDue { get; set; }
            public string txtForDiscount { get; set; }
            public string txtRSDiscount { get; set; }
            public List<Rows> Rows { get; set; }
        }

        public class DateValidate
        {
            public string txtInterestDue { get; set; }
            public string txtForDiscount { get; set; }
            public string txtRSDiscount { get; set; }
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


        public class DetailsMonthModel
        {
            public string txtNewPawnDate { get; set; }
            //public string txtAmountDue { get; set; }
            public totalPaidModel totalPaid { get; set; }
            public DetailsModel dateValidate { get; set; }
        }

        public class totalPaidModel
        {
            public string txtInterestDue { get; set; }
            public string txtForDiscount { get; set; }
            public string txtRSDiscount { get; set; }
            public string txtRemainingBal { get; set; }
            public List<Rows> rows { get; set; }
        }

        

        public class RenewalInsert 
        {
            public TblMain1 tblMain1 { get; set; }
            public TblMain3 tblMain3 { get; set; }
        }


        public class TblMain1 
        {
            public string txtTDate { get; set; }
            public string txtDocNumRenew { get; set; }
            public string txtReference { get; set; }
            public string txtControlNo { get; set; }
            public string txtRemarksRenew { get; set; }
            public string txtAmountDue { get; set; }
            public string cnCode { get; set; }
            public string dblPawnTicket { get; set; }
            public string txtBox { get; set; }
            public string txtNewPawnDate { get; set; }
            public string txtPawnDate { get; set; }
            public string txtRNPTNum { get; set; }
            public string txtPaidBy { get; set; }
            public string userCode { get; set; }

        }

        public class TblMain3
        {

            public string cnCode { get; set; }
            public string txtDocNumRenew { get; set; }
            public string txtCashRecieved { get; set; }
            public string txtChange { get; set; }
            public string txtPenalty { get; set; }
            public string txtServiceFee { get; set; }
            public string txtDiscount { get; set; }
            public string txtRSDiscount { get; set; }

        }



        




  


    }
}
