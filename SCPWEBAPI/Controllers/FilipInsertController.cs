using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using System.Data;
using static SCPWEBAPI.FldrModels.Models;
using static SCPWEBAPI.FldrModels.Models.SetupRSNumber;

namespace SCPWEBAPI.Controllers
{
	[ApiController]
	public class FilipInsertController : Controller
	{
		SqlConnection? myconnection;
		SqlCommand? mycommand;
		SqlDataReader? dr;
		SqlTransaction mytransaction;


		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertData")]
		public string InserCustData(CustomerData CustomerData1)
		{
			string SqlQuery = "INSERT INTO tblCustomer (ControlNo, CustCode, CustName, FirstName, MiddleName, LastName, ContactNo, BirthDate, ValidIDNumber, EmailAddress, Address, ZipCode, Active," +
				" CNCode, Street, BLD#, Province, City) Values (@_ControlNo, @_CustCode, @_CustName, @_FirstName, @_MiddleName, @_LastName, @_ContactNo, @_BirthDate, @_ValidIDNumber, @_EmailAddress," +
				" @_Address, @_ZipCode, @_Active,  @_CNCode, @_Street, @_BLD#, @_Province, @_City) ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ControlNo", SqlDbType.VarChar).Value = new ClsAutoNum().GetCustomersAutoNum(CustomerData1.CNCode)+CustomerData1.CNCode;
			mycommand.Parameters.Add("_CustCode", SqlDbType.VarChar).Value = new ClsAutoNum().GetCustomersAutoNum(CustomerData1.CNCode);
			mycommand.Parameters.Add("_CustName", SqlDbType.VarChar).Value = CustomerData1.FirstName + " " + CustomerData1.MiddleName + " " + CustomerData1.LastName;
			mycommand.Parameters.Add("_FirstName", SqlDbType.VarChar).Value = CustomerData1.FirstName;
			mycommand.Parameters.Add("_MiddleName", SqlDbType.VarChar).Value = CustomerData1.MiddleName;
			mycommand.Parameters.Add("_LastName", SqlDbType.VarChar).Value = CustomerData1.LastName;
			mycommand.Parameters.Add("_ContactNo", SqlDbType.VarChar).Value = CustomerData1.ContactNo;
			mycommand.Parameters.Add("_Address", SqlDbType.VarChar).Value = CustomerData1.Brgy + " " + CustomerData1.City + " " + CustomerData1.Province;
			mycommand.Parameters.Add("_BirthDate", SqlDbType.Date).Value = CustomerData1.Birthdate;
			mycommand.Parameters.Add("_ValidIDNumber", SqlDbType.VarChar).Value = CustomerData1.ValidIDNumber;
			mycommand.Parameters.Add("_EmailAddress", SqlDbType.VarChar).Value = CustomerData1.EmailAddress;
			mycommand.Parameters.Add("_ZipCode", SqlDbType.VarChar).Value = CustomerData1.ZipCode;
			mycommand.Parameters.Add("_Active", SqlDbType.Bit).Value = 1;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = CustomerData1.CNCode;
			mycommand.Parameters.Add("_Street", SqlDbType.VarChar).Value = CustomerData1.Street;
			mycommand.Parameters.Add("_BLD#", SqlDbType.VarChar).Value = CustomerData1.BuildingNo;
			mycommand.Parameters.Add("_Province", SqlDbType.VarChar).Value = CustomerData1.Province;
			mycommand.Parameters.Add("_City", SqlDbType.VarChar).Value = CustomerData1.City;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}


		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertDataTitus2024")]
		public string InsertDataTitus(TitusMDL TitusMDL1)

		{
			try
			{
				string SqlQuery = "Insert Into tblEntryTitus (TitusCode,TitusDesc,TitusDescSub,CNCode) Values (@_TitusCode,@_TitusDesc,@_TitusDescSub,@_CNCode)";
				myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
				myconnection.Open();
				mycommand = new SqlCommand(SqlQuery, myconnection);
				mycommand.Parameters.Add("_TitusCode", SqlDbType.VarChar).Value = TitusMDL1.TitusCode;
				mycommand.Parameters.Add("_TitusDesc", SqlDbType.VarChar).Value = TitusMDL1.TitusDesc;
				mycommand.Parameters.Add("_TitusDescSub", SqlDbType.VarChar).Value = TitusMDL1.TitusDescSub;
				mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = TitusMDL1.CNCode;
				mycommand.ExecuteNonQuery();
				myconnection.Close();

				return "Inserted";
			}
			catch (Exception)
			{
				throw;
			}
		}
		
		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertDataModel2024")]
		public string InsertDataModel(ModelMDL ModelMDL1)
		{
			string SqlQuery = "Insert Into tblEntryModel (ModelCode,ModelDesc,ModelDescSub,CNCode) Values (@_ModelCode,@_ModelDesc,@_ModelDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ModelCode", SqlDbType.VarChar).Value = ModelMDL1.ModelCode;
			mycommand.Parameters.Add("_ModelDesc", SqlDbType.VarChar).Value = ModelMDL1.ModelDesc;
			mycommand.Parameters.Add("_ModelDescSub", SqlDbType.VarChar).Value = ModelMDL1.ModelDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = ModelMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}

		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertDataBrand2024")]
		public string InsertDataBrand(BrandMDL BrandMDL1)
		{
			string SqlQuery = "Insert Into tblEntryBrand (BrandCode,BrandDesc,BrandDescSub,CNCode) Values (@_BrandCode,@_BrandDesc,@_BrandDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_BrandCode", SqlDbType.VarChar).Value = BrandMDL1.BrandCode;
			mycommand.Parameters.Add("_BrandDesc", SqlDbType.VarChar).Value = BrandMDL1.BrandDesc;
			mycommand.Parameters.Add("_BrandDescSub", SqlDbType.VarChar).Value = BrandMDL1.BrandDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = BrandMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}
		
		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertDataKarat2024")]
		public string InsertDataKarat(KaratMDL KaratMDL1)
		{
			string SqlQuery = "Insert Into tblEntryKarat (KaratCode,KaratDesc,KaratDescSub,CNCode) Values (@_KaratCode,@_KaratDesc,@_KaratDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_KaratCode", SqlDbType.VarChar).Value = KaratMDL1.KaratCode;
			mycommand.Parameters.Add("_KaratDesc", SqlDbType.VarChar).Value = KaratMDL1.KaratDesc;
			mycommand.Parameters.Add("_KaratDescSub", SqlDbType.VarChar).Value = KaratMDL1.KaratDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = KaratMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}


		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertDataMade2024")]
		public string InsertDataMade(MadeMDL MadeMDL1)
		{
			string SqlQuery = "Insert Into tblEntryMade (MadeCode,MadeDesc,MadeDescSub,CNCode) Values (@_MadeCode,@_MadeDesc,@_MadeDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_MadeCode", SqlDbType.VarChar).Value = MadeMDL1.MadeCode;
			mycommand.Parameters.Add("_MadeDesc", SqlDbType.VarChar).Value = MadeMDL1.MadeDesc;
			mycommand.Parameters.Add("_MadeDescSub", SqlDbType.VarChar).Value = MadeMDL1.MadeDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = MadeMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}

		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertDataBrithStoneColor2024")]
		public string InsertDataBirthStoneColor(BirthStoneColor BirthStoneColor1)
		{
			string SqlQuery = "Insert Into tblEntryBSColor (BSColorCode,BSColorDesc,BSColorDescSub,CNCode) Values (@_BSColorCode,@_BSColorDesc,@_BSColorDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_BSColorCode", SqlDbType.VarChar).Value = BirthStoneColor1.BSColorCode;
			mycommand.Parameters.Add("_BSColorDesc", SqlDbType.VarChar).Value = BirthStoneColor1.BSColorDesc;
			mycommand.Parameters.Add("_BSColorDescSub", SqlDbType.VarChar).Value = BirthStoneColor1.BSColorDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = BirthStoneColor1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}


		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertDataBrithStone2024")]
		public string InsertDataBirthStone(BirthStoneMDL BirthStoneMDL1)
		{
			string SqlQuery = "Insert Into tblEntryBirthStone (BirthStoneCode,BirthStoneDesc,CatCode,BSDescSub,CNCode) Values (@_BirthStoneCode,@_BirthStoneDesc,@_CatCode,@_BSDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_BirthStoneCode", SqlDbType.VarChar).Value = BirthStoneMDL1.BirthStoneCode;
			mycommand.Parameters.Add("_BirthStoneDesc", SqlDbType.VarChar).Value = BirthStoneMDL1.BirthStoneDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = BirthStoneMDL1.CatCode;
			mycommand.Parameters.Add("_BSDescSub", SqlDbType.VarChar).Value = BirthStoneMDL1.BSDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = BirthStoneMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}
		

		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertData/DiamondInsert2024")]
		public string InsertDataDiamond(DiamondMDL DiamondMDL1)
		{
			string SqlQuery = "Insert Into tblEntryDiamondShape (DiamondShapeCode,DiamondShapeDesc,CatCode,DiaShapeDescSub,CNCode) " +
				"Values (@_DiamondShapeCode,@_DiamondShapeDesc,@_CatCode,@_DiaShapeDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_DiamondShapeCode", SqlDbType.VarChar).Value = DiamondMDL1.DiamondShapeCode;
			mycommand.Parameters.Add("_DiamondShapeDesc", SqlDbType.VarChar).Value = DiamondMDL1.DiamondShapeDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = "000";
			mycommand.Parameters.Add("_DiaShapeDescSub", SqlDbType.VarChar).Value = DiamondMDL1.DiaShapeDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = DiamondMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}
		
		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertData/Items2024")]
		public string InsertDataItems(ItemsMDL ItemsMDL1)
		{
			string SqlQuery = "Insert Into tblEntryItem (ItemCode,ItemDesc,CatCode,ItemDescSub,CNCode) " +
				"Values (@_ItemCode,@_ItemDesc,@_CatCode,@_ItemDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ItemCode", SqlDbType.VarChar).Value = ItemsMDL1.ItemCode;
			mycommand.Parameters.Add("_ItemDesc", SqlDbType.VarChar).Value = ItemsMDL1.ItemDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = ItemsMDL1.CatCode;
			mycommand.Parameters.Add("_ItemDescSub", SqlDbType.VarChar).Value = ItemsMDL1.ItemDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = ItemsMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}
		
		
		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertData/Colors2024")]
		public string InsertDataColor(ColorsMDL ColorsMDL1)
		{
			string SqlQuery = "Insert Into tblEntryColor (ColorCode,ColorDesc,CatCode,ColorDescSub,CNCode) " +
				"Values (@_ColorCode,@_ColorDesc,@_CatCode,@_ColorDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ColorCode", SqlDbType.VarChar).Value = ColorsMDL1.ColorCode;
			mycommand.Parameters.Add("_ColorDesc", SqlDbType.VarChar).Value = ColorsMDL1.ColorDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = ColorsMDL1.CatCode;
			mycommand.Parameters.Add("_ColorDescSub", SqlDbType.VarChar).Value = ColorsMDL1.ColorDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = ColorsMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}


		[HttpPost]
		[Route("API/WEBAPI/Customer/InsertData/Condition2024")]
		public string InsertDataCondition(CondtionMDL CondtionMDL1)
		{
			string SqlQuery = "Insert Into tblEntryCondition (ConditionCode,ConditionDesc,CatCode,ConditionDescSub,CNCode) " +
				"Values (@_ConditionCode,@_ConditionDesc,@_CatCode,@_ConditionDescSub,@_CNCode)";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ConditionCode", SqlDbType.VarChar).Value = CondtionMDL1.ConditionCode;
			mycommand.Parameters.Add("_ConditionDesc", SqlDbType.VarChar).Value = CondtionMDL1.ConditionDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = CondtionMDL1.CatCode;
			mycommand.Parameters.Add("_ConditionDescSub", SqlDbType.VarChar).Value = CondtionMDL1.ConditionDescSub;
			mycommand.Parameters.Add("_CNCode", SqlDbType.VarChar).Value = CondtionMDL1.CNCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Inserted";
		}


	}
}
