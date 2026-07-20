
namespace SCPWEBAPI.FldrModels
{
    public class RenewalModel
    {   

        public class PawnTransactionRequest
        {
            public string CnCode { get; set; }
            public string MaturityDate { get; set; }
            public DateTime ExpDate { get; set; }
            public List<PawnItemDto> DataList { get; set; }
        }

		public class PawnItemDto
		{
			public string Item { get; set; }
			public string Made { get; set; }
			public string Color { get; set; }
			public string Condition { get; set; }
			public string Birthstone { get; set; }
			public decimal DiamondSize { get; set; }
			public string DiamondShape { get; set; }
			public decimal DiamondPrice { get; set; }
			public string Karat { get; set; }
			public string Weight { get; set; }
			public string SerialNo { get; set; }
			public string MotorNo { get; set; }
			public string ChassisNo { get; set; }

			// Dates included from your list
			//public DateTime? MaturityDate { get; set; }
			//public DateTime? ExpiryDate { get; set; }

			public string BirthstoneWeight { get; set; }
			public decimal BirthstonePcs { get; set; }
			public double InterestPercent { get; set; }
		}




	}
}

