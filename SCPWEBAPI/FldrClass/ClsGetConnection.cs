namespace SCPWEBAPI.FldrClass
{
    public class ClsGetConnection
    {
        public string PlsConnect()
        {

			// Local SQL 2022
			//return "Server = WINSERVER\\SQLEXPRESS; Initial Catalog=SCP_BE_NEW; Integrated Security=SSPI; Encrypt = false;"; //Rodrigo

			//return "Server = DESKTOP-DTK5R9C\\SQLEXPRESS; Initial Catalog=SCP_BE_NEW; Integrated Security=SSPI; Encrypt = false;"; //Rodrigo

			//Online
			
			return "Server = tcp:pawnshopcloud.database.windows.net,1433; Initial Catalog = SCP_BE_NEW; Persist Security Info = False; User ID = pawnshop; Password = Admin123; MultipleActiveResultSets = False; Encrypt = True; TrustServerCertificate = False; Connection Timeout = 30;";
			//return "Server = tcp:pawnshopcloud.database.windows.net,1433; Initial Catalog = SCP_BE; Persist Security Info = False; User ID = pawnshop; Password = Admin123; MultipleActiveResultSets = False; Encrypt = True; TrustServerCertificate = False; Connection Timeout = 30;";

		}

	}
}
