
namespace SCPWEBAPI.FldrModels
{
    public class PullOutModel
    {   



        public class SearhDetails
        {
            public string pawnTicket { get; set; }
            public string cnCode { get; set; }
        }



        public class PullOutMainModel
        {
            public VDateModel vDate { get; set; }
            public TicketDetails ticketDetails { get; set; }
            public DetailsModel detailsInfo { get; set; }
            public DetailsModel dateValidate { get; set; }

        }


	

		public class PullOutItem
        {
            public string CustName { get; set; }
            public string PawnTicketNew { get; set; }
            public string Box { get; set; }
            public string Post { get; set; }  
            public string PawnTicket { get; set; }
            public DateTime TDate { get; set; }

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

            public string txtServiceFee { get; set; }   
            public string txtPenalty { get; set; }
            public string txtDiscount { get; set; }
            public int noOfMonths { get; set; }

            public string txtTDate { get; set; }
            
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




  


    }
}
