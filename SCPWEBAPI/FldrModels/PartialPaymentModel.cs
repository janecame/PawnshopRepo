
namespace SCPWEBAPI.FldrModels
{
    public class PartialPaymentModel
    {   

        public class UpdatePP
        {
            public decimal PPAmount { get; set; }
            public string PawnTicket { get; set; }
            public string Remarks { get; set; }
            public string CnCode { get; set; }


        }   
    

    }
}
