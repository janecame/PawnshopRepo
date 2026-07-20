namespace SCPWEBAPI.FldrClass
{
    /*public static class ClsDateDiff
    {
        public static int GetMonths(DateTime startDate, DateTime endDate)
        {
            int months = ((endDate.Year * 12) + endDate.Month) - ((startDate.Year * 12) + startDate.Month);

            if (startDate > endDate)
            {
                return 1;
            }

            if (endDate.Day >= startDate.Day)
            {
                months++;
            }

            return months;
        }
    }*/



    public static class ClsDateDiff
    {
        public static int GetMonths(DateTime startDate, DateTime endDate)
        {
            int months;
            months = ((endDate.Year * 12) + endDate.Month) - ((startDate.Year * 12) + startDate.Month);

            if (startDate > endDate)
            {
                //throw new Exception("Start Date is greater than the End Date");
                months = 1;
            }else 

             //months = ((endDate.Year * 12) + endDate.Month) - ((startDate.Year * 12) + startDate.Month);

            if (endDate.Day >= startDate.Day)
            {
                months++;
            }

            return months;
        }
    }
}
