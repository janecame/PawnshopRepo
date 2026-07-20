using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;
using static SCPWEBAPI.FldrModels.Models.SetupRSNumber;

namespace SCPWEBAPI.Controllers
{
	[ApiController]
	public class FilipGetListController : Controller
	{
		SqlConnection myconnection;
		SqlCommand mycommand;
		SqlDataReader dr;


		[HttpGet]
		[Route("API/WebAPI/AutoNumCustCode")]
		public string GetActNameAutoNum(string strURICNCode)
		{
			return new ClsAutoNum().GetCustomersAutoNum(strURICNCode);
		}

		[HttpGet]
		[Route("API/WebApi/AutonNumCondition/Code")]
		public string GetCondiotionCode(string strURICNCode)
		{
			return new ClsAutoNum().GetConditionAutoNum(strURICNCode);
		}	
		
		[HttpGet]
		[Route("API/WebApi/GetAutonNumAll/Code")]
		public string GetAutoNumAll(string strCNCode, string strCode, string strtblName)
		{
			Console.WriteLine(strCNCode, strCode, strtblName);
			return new ClsAutoNum().GetAutoNum(strCNCode, strCode, strtblName);
		}

		[HttpGet]
		[Route("API/Web/GetCustomer/details")]
		public IEnumerable<CustomerData> GetCustomerDetails(string strURICNCode)
		{
			List<CustomerData> CustomerDataMSSQL = new List<CustomerData>();
			string SqlQuery = $"SELECT * FROM tblCustomer WHERE  CNCode = '{strURICNCode}' ORDER BY CustName";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				CustomerData CustomerData1 = new CustomerData
				{
					ControlNo = dr["ControlNo"].ToString(),
					LastName = dr["LastName"].ToString(),
					FirstName = dr["FirstName"].ToString(),
					BuildingNo = dr["BLD#"].ToString(),
					Street = dr["Street"].ToString(),
					MiddleName = dr["MiddleName"].ToString(),
					ContactNo = dr["ContactNo"].ToString(),
					//Birthdate =  DateTime.Parse(dr["Birthdate"].ToString()),
					Birthdate = dr["Birthdate"] == DBNull.Value ? (DateTime?)null : DateTime.Parse(dr["Birthdate"].ToString()),
					ValidIDNumber = dr["ValidIDNumber"].ToString(),
					EmailAddress = dr["EmailAddress"].ToString(),
					Address = dr["Address"].ToString(),
					ZipCode = dr["ZipCode"].ToString(),
					Province = dr["Province"].ToString(),
					Active =	dr["Active"].ToString()

				};
				CustomerDataMSSQL.Add(CustomerData1);
			}
			myconnection.Close();
			return CustomerDataMSSQL;
		}

		[HttpGet]
		[Route("API/Web/GetCondition/details")]
		public IEnumerable<CondtionMDL> GetCondtionDetails(string strURICNCode)
		{
			List<CondtionMDL> CondtionMDLMSSQL = new List<CondtionMDL>();
			string SqlQuery = $"SELECT * FROM tblEntryCondition WHERE  CNCode = '{strURICNCode}' ORDER BY ConditionCode";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				CondtionMDL CondtionMDL1 = new CondtionMDL
				{
					ConditionCode = dr["ConditionCode"].ToString(),
					ConditionDesc = dr["ConditionDesc"].ToString(),
					CatCode = dr["CatCode"].ToString(),
					ConditionDescSub = dr["ConditionDescSub"].ToString(),
					CNCode = dr["CNCode"].ToString(),
				};
				CondtionMDLMSSQL.Add(CondtionMDL1);
			}
			myconnection.Close();
			return CondtionMDLMSSQL;
		}

		[HttpGet]
		[Route("API/Web/GetColor/details")]
		public IEnumerable<ColorsMDL> GetListColor(string strURICNCode)
		{
			List<ColorsMDL> ColorsMDLMSSQL = new List<ColorsMDL>();
			string SqlQuery = $"SELECT * FROM tblEntryColor WHERE  CNCode = '{strURICNCode}' ORDER BY ColorCode";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				ColorsMDL ColorsMDL1 = new ColorsMDL
				{
					ColorCode = dr["ColorCode"].ToString(),
					ColorDesc = dr["ColorDesc"].ToString(),
					CatCode = dr["CatCode"].ToString(),
					ColorDescSub = dr["ColorDescSub"].ToString(),
					CNCode = dr["CNCode"].ToString(),
				};
				ColorsMDLMSSQL.Add(ColorsMDL1);
			}
			myconnection.Close();
			return ColorsMDLMSSQL;
		}


		[HttpGet]
		[Route("WEB/API/GetListItem/Data")]
		public IEnumerable<ItemsMDL> GetListItems(string strCNCode)
		{
			List<ItemsMDL> ItemsMDLMSSQL = new List<ItemsMDL>();
			string SQLQuery = $"Select * from tblEntryItem Where CNCode='{strCNCode}'";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()) ;
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				ItemsMDL ItemsMDL1 = new ItemsMDL
				{
					ItemCode = dr["ItemCode"].ToString(),
					ItemDesc = dr["ItemDesc"].ToString(),
					CatCode = dr["CatCode"].ToString(),
					ItemDescSub = dr["ItemDescSub"].ToString(),
					CNCode = dr["CNCode"].ToString(),


				};
				ItemsMDLMSSQL.Add(ItemsMDL1);
			}
			myconnection.Close();
			return ItemsMDLMSSQL;

		}

		[HttpGet]
		[Route("WEB/API/GetCategory")]
		public IEnumerable<CategoryMDL> GetCategory()
		{
			List<CategoryMDL> CategoryMDLMSSQL = new List<CategoryMDL>();
			string SQLQuery = $"Select * From tblCategory";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				CategoryMDL CategoryMDL = new CategoryMDL
				{

					CatCode = dr["CatCode"].ToString(),
					CatDesc = dr["CatDesc"].ToString(),

				};
				CategoryMDLMSSQL.Add(CategoryMDL);
			}
			myconnection.Close();
			return CategoryMDLMSSQL;
		}

		[HttpGet]
		[Route("WEB/API/GetDiamondShape")]
		public IEnumerable<DiamondMDL> GetDiamond(string strURICNCode)
		{
			List<DiamondMDL> DiamondMDLMSSQL = new List<DiamondMDL>();
			string SQLQuery = $"Select * From tblEntryDiamondShape where CNCode = '{strURICNCode}'";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				DiamondMDL DiamondMDL1 = new DiamondMDL
				{

					DiamondShapeCode = dr["DiamondShapeCode"].ToString(),
					DiamondShapeDesc = dr["DiamondShapeDesc"].ToString(),
					CatCode = dr["CatCode"].ToString(),
					DiaShapeDescSub = dr["DiaShapeDescSub"].ToString(),
					CNCode = dr["CNCode"].ToString()
					

				};
				DiamondMDLMSSQL.Add(DiamondMDL1);
			}
			myconnection.Close();
			return DiamondMDLMSSQL;
		}
		
		[HttpGet]
		[Route("WEB/API/BirthStone2024")]
		public IEnumerable<BirthStoneMDL> GetBirthStone(string strURICNCode)
		{
			List<BirthStoneMDL> BirthStoneMDLMSSQL = new List<BirthStoneMDL>();
			string SQLQuery = $"Select * From tblEntryBirthStone where CNCode = '{strURICNCode}'";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				BirthStoneMDL BirthStoneMDL1 = new BirthStoneMDL
				{

					BirthStoneCode = dr["BirthStoneCode"].ToString(),
					BirthStoneDesc = dr["BirthStoneDesc"].ToString(),
					CatCode = dr["CatCode"].ToString(),
					BSDescSub = dr["BSDescSub"].ToString(),
					

				};
				BirthStoneMDLMSSQL.Add(BirthStoneMDL1);
			}
			myconnection.Close();
			return BirthStoneMDLMSSQL;
		}
		
		[HttpGet]
		[Route("WEB/API/BirthStoneColor2024")]
		public IEnumerable<BirthStoneColor> GetBirthStoneColor(string strURICNCode)
		{
			List<BirthStoneColor> BirthStoneColorMSSQL = new List<BirthStoneColor>();
			string SQLQuery = $"Select * From tblEntryBSColor where CNCode = '{strURICNCode}'";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				BirthStoneColor BirthStoneColor1 = new BirthStoneColor
				{
					BSColorCode = dr["BSColorCode"].ToString(),
					BSColorDesc = dr["BSColorDesc"].ToString(),
					BSColorDescSub = dr["BSColorDescSub"].ToString(),
				};
				BirthStoneColorMSSQL.Add(BirthStoneColor1);
			}
			myconnection.Close();
			return BirthStoneColorMSSQL;
		}
		
		[HttpGet]
		[Route("WEB/API/Calling/MadeAPI2024")]
		public IEnumerable<MadeMDL> GetMade(string strURICNCode)
		{
			List<MadeMDL> MadeMDLMSSQL = new List<MadeMDL>();
			string SQLQuery = $"Select * From tblEntryMade where CNCode = '{strURICNCode}'";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				MadeMDL MadeMDL1 = new MadeMDL
				{
					MadeCode = dr["MadeCode"].ToString(),
					MadeDesc = dr["MadeDesc"].ToString(),
					MadeDescSub = dr["MadeDescSub"].ToString(),
				};
				MadeMDLMSSQL.Add(MadeMDL1);
			}
			myconnection.Close();
			return MadeMDLMSSQL;
		}
		[HttpGet]
		[Route("WEB/API/Calling/KaratAPI2024")]
		public IEnumerable<KaratMDL> GetKarat(string strURICNCode)
		{
			List<KaratMDL> KaratMDLMSSQL = new List<KaratMDL>();
			string SQLQuery = $"Select * From tblEntryKarat where CNCode = '{strURICNCode}'";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				KaratMDL KaratMDL1 = new KaratMDL
				{
					KaratCode = dr["KaratCode"].ToString(),
					KaratDesc = dr["KaratDesc"].ToString(),
					KaratDescSub = dr["KaratDescSub"].ToString(),
				};
				KaratMDLMSSQL.Add(KaratMDL1);
			}
			myconnection.Close();
			return KaratMDLMSSQL;
		}
		
		[HttpGet]
		[Route("WEB/API/Calling/BrandAPI2024")]
		public IEnumerable<BrandMDL> GetBrand(string strURICNCode)
		{
			List<BrandMDL> BrandMDLMSSQL = new List<BrandMDL>();
			string SQLQuery = $"Select * From tblEntryBrand where CNCode = '{strURICNCode}' AND BrandCode <> '00' ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				BrandMDL BrandMDL1 = new BrandMDL
				{
					BrandCode = dr["BrandCode"].ToString(),
					BrandDesc = dr["BrandDesc"].ToString(),
					BrandDescSub = dr["BrandDescSub"].ToString(),
				};
				BrandMDLMSSQL.Add(BrandMDL1);
			}
			myconnection.Close();
			return BrandMDLMSSQL;
		}
		
		
		[HttpGet]
		[Route("WEB/API/Calling/ModelAPI2024")]
		public IEnumerable<ModelMDL> GetModel(string strURICNCode)
		{
			List<ModelMDL> ModelMDLMSSQL = new List<ModelMDL>();
			string SQLQuery = $"Select * From tblEntryModel where CNCode = '{strURICNCode}' AND ModelCode <> '00' ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				ModelMDL ModelMDL1 = new ModelMDL
				{
					ModelCode = dr["ModelCode"].ToString(),
					ModelDesc = dr["ModelDesc"].ToString(),
					ModelDescSub = dr["ModelDescSub"].ToString(),
				};
				ModelMDLMSSQL.Add(ModelMDL1);
			}
			myconnection.Close();
			return ModelMDLMSSQL;
		}
		
		[HttpGet]
		[Route("WEB/API/Calling/TitusAPI2024")]
		public IEnumerable<TitusMDL> GetTitus(string strURICNCode)
		{
			List<TitusMDL> ModelMDLMSSQL = new List<TitusMDL>();
			string SQLQuery = $"Select * From tblEntryTitus where CNCode = '{strURICNCode}' AND TitusCode <> '00' ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SQLQuery, myconnection);
			dr = mycommand.ExecuteReader();
			while (dr.Read())
			{
				TitusMDL TitusMDL1 = new TitusMDL
				{
					TitusCode = dr["TitusCode"].ToString(),
					TitusDesc = dr["TitusDesc"].ToString(),
					TitusDescSub = dr["TitusDescSub"].ToString(),
				};
				ModelMDLMSSQL.Add(TitusMDL1);
			}
			myconnection.Close();
			return ModelMDLMSSQL;
		}

	}
}