using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using System.Data;
using System.Diagnostics;
using static SCPWEBAPI.FldrModels.Models;

namespace SCPWEBAPI.Controllers
{
	[ApiController]
	public class FilipUpdateController : Controller
	{
		private SqlConnection? myconnection;

		private SqlCommand? mycommand;

		private SqlDataReader? dr;

		private SqlTransaction mytransaction;



		[HttpPut]
		[Route("Web/API/UpdateData/Color2024")]
		public string UpdateColor(ColorsMDL ColorsMDL1)
		{
			string SqlQuery = $"Update tblEntryColor Set ColorDesc=@_ColorDesc,ColorDescSub=@_ColorDescSub " +
				$"Where CNCode={ColorsMDL1.CNCode} AND  ColorCode={ColorsMDL1.ColorCode}";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ColorDesc", SqlDbType.VarChar).Value = ColorsMDL1.ColorDesc;
			mycommand.Parameters.Add("_ColorDescSub", SqlDbType.VarChar).Value = ColorsMDL1.ColorDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			//Debug.WriteLine(ColorsMDL1);
			return "Updated";
		}

		[HttpPut]
		[Route("Web/API/UpdateData/Items2024")]
		public string UpdatetDataItems(ItemsMDL ItemsMDL1)
		{
			string SqlQuery = $"Update tblEntryItem Set ItemDesc=@_ItemDesc,CatCode=@_CatCode,ItemDescSub=@_ItemDescSub " +
				$"Where CNCode={ItemsMDL1.CNCode} AND ItemCode={ItemsMDL1.ItemCode} ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ItemDesc", SqlDbType.VarChar).Value = ItemsMDL1.ItemDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = ItemsMDL1.CatCode;
			mycommand.Parameters.Add("_ItemDescSub", SqlDbType.VarChar).Value = ItemsMDL1.ItemDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}
		
		
		[HttpPut]
		[Route("Web/API/UpdateData/Diamond2024")]
		public string UpdatetDataDiamond(DiamondMDL DiamondMDL1)
		{
			string SqlQuery = $"Update  tblEntryDiamondShape Set DiamondShapeDesc=@_DiamondShapeDesc,CatCode=@_CatCode,DiaShapeDescSub=@_DiaShapeDescSub " +
			$"Where CNCode={DiamondMDL1.CNCode} AND DiamondShapeCode={DiamondMDL1.DiamondShapeCode}";

			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_DiamondShapeDesc", SqlDbType.VarChar).Value = DiamondMDL1.DiamondShapeDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = "000";
			mycommand.Parameters.Add("_DiaShapeDescSub", SqlDbType.VarChar).Value = DiamondMDL1.DiaShapeDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();


			return "Updated";
		}
		
		[HttpPut]
		[Route("Web/API/UpdateData/BirthStone2024")]
		public string UpdatetDataBirthStoneMDL(BirthStoneMDL BirthStoneMDL1)
		{
			string SqlQuery = $"Update tblEntryBirthStone set BirthStoneDesc=@_BirthStoneDesc,CatCode=@_CatCode,BSDescSub=@_BSDescSub" +
				$" Where CNCode={BirthStoneMDL1.CNCode} AND BirthStoneCode={BirthStoneMDL1.BirthStoneCode}";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_BirthStoneDesc", SqlDbType.VarChar).Value = BirthStoneMDL1.BirthStoneDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = BirthStoneMDL1.CatCode;
			mycommand.Parameters.Add("_BSDescSub", SqlDbType.VarChar).Value = BirthStoneMDL1.BSDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}
		
		[HttpPut]
		[Route("Web/API/UpdateData/BirthStoneColor2024")]
		public string UpdatetDataBirthStoneColorL(BirthStoneColor BirthStoneColor)
		{
			string SqlQuery = $"Update tblEntryBSColor set BSColorDesc=@_BSColorDesc,BSColorDescSub=@_BSColorDescSub " +
				$"where CNCode={BirthStoneColor.CNCode} AND BSColorCode={BirthStoneColor.BSColorCode} ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_BSColorDesc", SqlDbType.VarChar).Value = BirthStoneColor.BSColorDesc;
			mycommand.Parameters.Add("_BSColorDescSub", SqlDbType.VarChar).Value = BirthStoneColor.BSColorDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();
			return "Updated";
		}

		[HttpPut]
		[Route("Web/API/UpdateData/Made2024")]
		public string UpdatetDataMade(MadeMDL MadeMDL1)
		{
			string SqlQuery = $"Update tblEntryMade Set MadeDesc = @_MadeDesc, MadeDescSub = @_MadeDescSub " +
				$"Where CNCode={MadeMDL1.CNCode} AND MadeCode={MadeMDL1.MadeCode}";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_MadeDesc", SqlDbType.VarChar).Value = MadeMDL1.MadeDesc;
			mycommand.Parameters.Add("_MadeDescSub", SqlDbType.VarChar).Value = MadeMDL1.MadeDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}
		
		[HttpPut]
		[Route("Web/API/UpdateData/Karat2024")]
		public string UpdatetDataKarat(KaratMDL KaratMDL1)
		{
			string SqlQuery = $"Update tblEntryKarat Set KaratDesc = @_KaratDesc, KaratDescSub = @_KaratDescSub " +
				$"Where CNCode={KaratMDL1.CNCode} AND KaratCode={KaratMDL1.KaratCode} ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_KaratDesc", SqlDbType.VarChar).Value = KaratMDL1.KaratDesc;
			mycommand.Parameters.Add("_KaratDescSub", SqlDbType.VarChar).Value = KaratMDL1.KaratDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}
		
		
		[HttpPut]
		[Route("Web/API/UpdateData/Brand2024")]
		public string UpdatetDataBrand(BrandMDL BrandMDL1)
		{
			string SqlQuery = $"Update tblEntryBrand Set BrandDesc = @_BrandDesc,BrandDescSub = @_BrandDescSub " +
				$"Where CNCode={BrandMDL1.CNCode} AND BrandCode={BrandMDL1.BrandCode}";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_BrandDesc", SqlDbType.VarChar).Value = BrandMDL1.BrandDesc;
			mycommand.Parameters.Add("_BrandDescSub", SqlDbType.VarChar).Value = BrandMDL1.BrandDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}
		
		[HttpPut]
		[Route("Web/API/UpdateData/Model2024")]
		public string UpdatetDataModel(ModelMDL ModelMDL1)
		{
			string SqlQuery = $"Update tblEntryModel Set ModelDesc = @_ModelDesc, ModelDescSub = @_ModelDescSub" +
				$" Where CNCode={ModelMDL1.CNCode} AND ModelCode={ModelMDL1.ModelCode} ";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ModelDesc", SqlDbType.VarChar).Value = ModelMDL1.ModelDesc;
			mycommand.Parameters.Add("_ModelDescSub", SqlDbType.VarChar).Value = ModelMDL1.ModelDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}


		[HttpPut]
		[Route("Web/API/UpdateData/Titus2024")]
		public string UpdatetDataTitus(TitusMDL TitusMDL1)
		{
			string SqlQuery = $"Update tblEntryTitus Set TitusDesc = @_TitusDesc,TitusDescSub = @_TitusDescSub " +
				$" Where CNCode={TitusMDL1.CNCode} AND TitusCode={TitusMDL1.TitusCode}";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_TitusDesc", SqlDbType.VarChar).Value = TitusMDL1.TitusDesc;
			mycommand.Parameters.Add("_TitusDescSub", SqlDbType.VarChar).Value = TitusMDL1.TitusDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}
		
		
		[HttpPut]
		[Route("Web/API/UpdateData/Condiotion2024")]
		public string UpdatetDataCondition(CondtionMDL CondtionMDL1)
		{
			string SqlQuery = "Update tblEntryCondition Set ConditionDesc = @_ConditionDesc,CatCode = @_CatCode,ConditionDescSub = @_ConditionDescSub " +
				$" Where CNCode={CondtionMDL1.CNCode} AND ConditionCode={CondtionMDL1.ConditionCode}";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_ConditionDesc", SqlDbType.VarChar).Value = CondtionMDL1.ConditionDesc;
			mycommand.Parameters.Add("_CatCode", SqlDbType.VarChar).Value = CondtionMDL1.CatCode;
			mycommand.Parameters.Add("_ConditionDescSub", SqlDbType.VarChar).Value = CondtionMDL1.ConditionDescSub;
			mycommand.ExecuteNonQuery();
			myconnection.Close();


			return "Updated";
		}

		[HttpPut]
		[Route("Web/API/UpdateData/CustomerData2024")]
		public string UpdatetDataCustomer(CustomerData CustomerData1)
		{
			string SqlQuery = $"Update tblCustomer set CustName = @_CustName, FirstName = @_FirstName, MiddleName=@_MiddleName, LastName=@_LastName, ContactNo=@_ContactNo, " +
				$"BirthDate=@_BirthDate,ValidIDNumber = @_ValidIDNumber, EmailAddress = @_EmailAddress, Address=@_Address, Active=@_Active,ZipCode=@_ZipCode, Street=@_Street, BLD#=@_BLD#, " +
				$"Province=@_Province, City=@_City  Where CNCode={CustomerData1.CNCode} AND ControlNo={CustomerData1.ControlNo}";
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();
			mycommand = new SqlCommand(SqlQuery, myconnection);
			mycommand.Parameters.Add("_CustName", SqlDbType.VarChar).Value = CustomerData1.FirstName + " " + CustomerData1.MiddleName + " " + CustomerData1.LastName;
			mycommand.Parameters.Add("_Address", SqlDbType.VarChar).Value = CustomerData1.Brgy + " " + CustomerData1.City + " " + CustomerData1.Province;
			mycommand.Parameters.Add("_FirstName", SqlDbType.VarChar).Value = CustomerData1.FirstName;
			mycommand.Parameters.Add("_MiddleName", SqlDbType.VarChar).Value = CustomerData1.MiddleName;
			mycommand.Parameters.Add("_LastName", SqlDbType.VarChar).Value = CustomerData1.LastName;
			mycommand.Parameters.Add("_ContactNo", SqlDbType.VarChar).Value = CustomerData1.ContactNo;
			mycommand.Parameters.Add("_BirthDate", SqlDbType.Date).Value = CustomerData1.Birthdate;
			mycommand.Parameters.Add("_ValidIDNumber", SqlDbType.VarChar).Value = CustomerData1.ValidIDNumber;
			mycommand.Parameters.Add("_EmailAddress", SqlDbType.VarChar).Value = CustomerData1.EmailAddress;
			mycommand.Parameters.Add("_Active", SqlDbType.Bit).Value = CustomerData1.Active;
			mycommand.Parameters.Add("_Street", SqlDbType.VarChar).Value = CustomerData1.Street;
			mycommand.Parameters.Add("_BLD#", SqlDbType.VarChar).Value = CustomerData1.BuildingNo;
			mycommand.Parameters.Add("_Province", SqlDbType.VarChar).Value = CustomerData1.Province;
			mycommand.Parameters.Add("_City", SqlDbType.VarChar).Value = CustomerData1.City;
			mycommand.Parameters.Add("_ZipCode", SqlDbType.VarChar).Value = CustomerData1.ZipCode;
			mycommand.ExecuteNonQuery();
			myconnection.Close();

			return "Updated";
		}




	}
}
