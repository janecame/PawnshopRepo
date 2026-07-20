using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;
using System.Data;
using Microsoft.SqlServer.Server;
using System.Text.Json;
using Azure.Core;
using Newtonsoft.Json;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    public class InsertController : Controller
    {
        Utilities Utilities1 = new Utilities();

        [HttpPost]
        [Route("API/SCPWEBAPI/InsertBoxNumber")]
        public IActionResult UpdateSetupEarlyRenewal([FromBody] List<MdltblSetupBoxnumber> request)
        {
            if (request == null || request.Count == 0)
            {
                return BadRequest("Request cannot be null or empty");
            }

            Console.WriteLine("Received request: " + Newtonsoft.Json.JsonConvert.SerializeObject(request));

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            foreach (var item in request)
                            {
                                if (item != null)
                                {
                                    string insertSql = "INSERT INTO tblSetupBoxNo (CNCode, BoxNo, Available) VALUES (@CNCode, @BoxNo, @Available)";
                                    using (SqlCommand command = new SqlCommand(insertSql, myconnection, transaction))
                                    {
                                        command.Parameters.Add("CNCode", SqlDbType.Char).Value = item.CNCode;
                                        command.Parameters.Add("BoxNo", SqlDbType.VarChar).Value = item.BoxNo;
                                        command.Parameters.Add("Available", SqlDbType.Bit).Value = item.Available;
                                        command.ExecuteNonQuery();
                                    }
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }

                return Ok("OK");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        //[HttpPost]
        //[Route("API/SCPWEBAPI/ProductSave")]
        //public IActionResult ProductSave([FromBody] List<ProductModel> products)
        //{
        //    try
        //    {
        //        if (products == null || products.Count == 0)
        //        {
        //            return BadRequest("Request cannot be null or empty");
        //        }

        //        Console.WriteLine("Received request: " + Newtonsoft.Json.JsonConvert.SerializeObject(products));

        //        using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
        //        {
        //            myconnection.Open();
        //            string sqlstatementstocks = @"INSERT INTO tblStocks(PKProdNumber, CNCode, ProdNumber, ItemCode, CatCode, MadeCode, ColorCode, ConditionCode, BirthStoneCode, DiamondSize, DiamondShapeCode, DiamondPrice, 
        //                          KaratCode, Weight, SerialNo, PlateNo, BSPcs, Remarks1, Remarks2, ProdQty, ProdDesign, TitusCode, TitusShapeCode, TitusQty, TitusSize, TitusPrice, TitusAppVal, 
        //                          DDD, Dial, BrandCode, BSAppWT, BSJewelWT, BSStoneWT, Size, ModelCode, AccessoriesAvail, AccessoriesMiss)
        //                          VALUES(@_PKProdNumber, @_CNCode, @_ProdNumber, @_ItemCode, @_CatCode, @_MadeCode, @_ColorCode, @_ConditionCode, @_BirthStoneCode, @_DiamondSize, @_DiamondShapeCode, @_DiamondPrice, 
        //                          @_KaratCode, @_Weight, @_SerialNo, @_PlateNo, @_BSPcs, @_Remarks1, @_Remarks2, @_ProdQty, @_ProdDesign, @_TitusCode, @_TitusShapeCode, @_TitusQty, @_TitusSize, @_TitusPrice, @_TitusAppVal, 
        //                          @_DDD, @_Dial, @_BrandCode, @_BSAppWT, @_BSJewelWT, @_BSStoneWT, @_Size, @_ModelCode, @_AccessoriesAvail, @_AccessoriesMiss)";

        //            foreach (var product in products)
        //            {
        //                using (var mycommand = new SqlCommand(sqlstatementstocks, myconnection))
        //                {
        //                    string strProdNumber = Utilities1.ProductAdd(product.CNCode);

        //                    mycommand.Parameters.AddWithValue("_PKProdNumber", strProdNumber + product.CNCode);
        //                    mycommand.Parameters.AddWithValue("_CNCode", product.CNCode);
        //                    mycommand.Parameters.AddWithValue("_ProdNumber", strProdNumber);
        //                    mycommand.Parameters.AddWithValue("_ItemCode", product.ItemCode);
        //                    mycommand.Parameters.AddWithValue("_CatCode", product.CatCode);
        //                    mycommand.Parameters.AddWithValue("_MadeCode", product.MadeCode);
        //                    mycommand.Parameters.AddWithValue("_ColorCode", product.ColorCode);
        //                    mycommand.Parameters.AddWithValue("_ConditionCode", product.ConditionCode);
        //                    mycommand.Parameters.AddWithValue("_BirthStoneCode", product.BirthStoneCode);
        //                    mycommand.Parameters.AddWithValue("_DiamondSize", product.DiamondSize);
        //                    mycommand.Parameters.AddWithValue("_DiamondShapeCode", product.DiamondShapeCode);
        //                    mycommand.Parameters.AddWithValue("_DiamondPrice", product.DiamondPrice);
        //                    mycommand.Parameters.AddWithValue("_KaratCode", product.KaratCode);
        //                    mycommand.Parameters.AddWithValue("_Weight", product.Weight);
        //                    mycommand.Parameters.AddWithValue("_SerialNo", product.SerialNo);
        //                    mycommand.Parameters.AddWithValue("_PlateNo", product.PlateNo);
        //                    mycommand.Parameters.AddWithValue("_BSPcs", product.BSPcs);
        //                    mycommand.Parameters.AddWithValue("_Remarks1", "NA");
        //                    mycommand.Parameters.AddWithValue("_Remarks2", "NA");
        //                    mycommand.Parameters.AddWithValue("_ProdQty", product.ProdQty);
        //                    mycommand.Parameters.AddWithValue("_ProdDesign", "NA");
        //                    mycommand.Parameters.AddWithValue("_TitusCode", "01");
        //                    mycommand.Parameters.AddWithValue("_TitusShapeCode", "01");
        //                    mycommand.Parameters.AddWithValue("_TitusQty", "0");
        //                    mycommand.Parameters.AddWithValue("_TitusSize", "0.00");
        //                    mycommand.Parameters.AddWithValue("_TitusPrice", "0.00");
        //                    mycommand.Parameters.AddWithValue("_TitusAppVal", "0.00");
        //                    mycommand.Parameters.AddWithValue("_DDD", "NA");
        //                    mycommand.Parameters.AddWithValue("_Dial", "NA");
        //                    mycommand.Parameters.AddWithValue("_BrandCode", "01");
        //                    mycommand.Parameters.AddWithValue("_BSAppWT", "0.00");
        //                    mycommand.Parameters.AddWithValue("_BSJewelWT", "0.00");
        //                    mycommand.Parameters.AddWithValue("_BSStoneWT", "0.00");
        //                    mycommand.Parameters.AddWithValue("_Size", "NA");
        //                    mycommand.Parameters.AddWithValue("_ModelCode", "NA");
        //                    mycommand.Parameters.AddWithValue("_AccessoriesAvail", "NA");
        //                    mycommand.Parameters.AddWithValue("_AccessoriesMiss", "NA");

        //                    mycommand.ExecuteNonQuery();
        //                }
        //            }

        //            return Ok("Products saved");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPost]
        [Route("API/SCPWEBAPI/SaveTransaction")]
        public IActionResult SaveTransaction([FromBody] SaveTransactionModel transactionModel)
        {
            try
            {
                var products = transactionModel.Products;
                var main1 = transactionModel.Main1;
                var main2 = transactionModel.Main2Items;

                if (main1 == null || main2 == null || !main2.Any() || products == null || !products.Any())
                {
                    return BadRequest("Request cannot be null or empty");
                }

                Console.WriteLine(JsonConvert.SerializeObject(transactionModel));


                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();

                    using (var transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            string sqlstatementstocks = @"INSERT INTO tblStocks(PKProdNumber, CNCode, ProdNumber, ItemCode, CatCode, MadeCode, ColorCode, ConditionCode, BirthStoneCode, DiamondSize, DiamondShapeCode, DiamondPrice, 
                                  KaratCode, Weight, SerialNo, PlateNo, BSPcs, Remarks1, Remarks2, ProdQty, ProdDesign, TitusCode, TitusShapeCode, TitusQty, TitusSize, TitusPrice, TitusAppVal, 
                                  DDD, Dial, BrandCode, BSAppWT, BSJewelWT, BSStoneWT, Size, ModelCode, AccessoriesAvail, AccessoriesMiss)
                                  VALUES(@_PKProdNumber, @_CNCode, @_ProdNumber, @_ItemCode, @_CatCode, @_MadeCode, @_ColorCode, @_ConditionCode, @_BirthStoneCode, @_DiamondSize, @_DiamondShapeCode, @_DiamondPrice, 
                                  @_KaratCode, @_Weight, @_SerialNo, @_PlateNo, @_BSPcs, @_Remarks1, @_Remarks2, @_ProdQty, @_ProdDesign, @_TitusCode, @_TitusShapeCode, @_TitusQty, @_TitusSize, @_TitusPrice, @_TitusAppVal, 
                                  @_DDD, @_Dial, @_BrandCode, @_BSAppWT, @_BSJewelWT, @_BSStoneWT, @_Size, @_ModelCode, @_AccessoriesAvail, @_AccessoriesMiss)";


                            List<string> pkProdNumbers = new List<string>();
                            string lastProdNumber = Utilities1.ProductAdd(products.First().CNCode);

                            foreach (var product in products)
                            {
                                using (var mycommand = new SqlCommand(sqlstatementstocks, myconnection, transaction))
                                {
                                    // Increment the ProdNumber
                                    int nextProdNumber = int.Parse(lastProdNumber) + 1;
                                    string strProdNumber = nextProdNumber.ToString("D6");

                                    //Console.WriteLine(strProdNumber);

                                    mycommand.Parameters.AddWithValue("_PKProdNumber", strProdNumber + product.CNCode);
                                    mycommand.Parameters.AddWithValue("_CNCode", product.CNCode);
                                    mycommand.Parameters.AddWithValue("_ProdNumber", strProdNumber);
                                    mycommand.Parameters.AddWithValue("_ItemCode", product.ItemCode);
                                    mycommand.Parameters.AddWithValue("_CatCode", product.CatCode);
                                    mycommand.Parameters.AddWithValue("_MadeCode", product.MadeCode);
                                    mycommand.Parameters.AddWithValue("_ColorCode", product.ColorCode);
                                    mycommand.Parameters.AddWithValue("_ConditionCode", product.ConditionCode);
                                    mycommand.Parameters.AddWithValue("_BirthStoneCode", product.BirthStoneCode);
                                    mycommand.Parameters.AddWithValue("_DiamondSize", product.DiamondSize);
                                    mycommand.Parameters.AddWithValue("_DiamondShapeCode", product.DiamondShapeCode);
                                    mycommand.Parameters.AddWithValue("_DiamondPrice", product.DiamondPrice);
                                    mycommand.Parameters.AddWithValue("_KaratCode", product.KaratCode);
                                    mycommand.Parameters.AddWithValue("_Weight", product.Weight);
                                    mycommand.Parameters.AddWithValue("_SerialNo", product.SerialNo);
                                    mycommand.Parameters.AddWithValue("_PlateNo", product.PlateNo);
                                    mycommand.Parameters.AddWithValue("_BSPcs", product.BSPcs);
                                    mycommand.Parameters.AddWithValue("_Remarks1", "NA");
                                    mycommand.Parameters.AddWithValue("_Remarks2", "NA");
                                    mycommand.Parameters.AddWithValue("_ProdQty", product.ProdQty);
                                    mycommand.Parameters.AddWithValue("_ProdDesign", "NA");
                                    mycommand.Parameters.AddWithValue("_TitusCode", "01");
                                    mycommand.Parameters.AddWithValue("_TitusShapeCode", "01");
                                    mycommand.Parameters.AddWithValue("_TitusQty", "0");
                                    mycommand.Parameters.AddWithValue("_TitusSize", "0.00");
                                    mycommand.Parameters.AddWithValue("_TitusPrice", "0.00");
                                    mycommand.Parameters.AddWithValue("_TitusAppVal", "0.00");
                                    mycommand.Parameters.AddWithValue("_DDD", "NA");
                                    mycommand.Parameters.AddWithValue("_Dial", "NA");
                                    mycommand.Parameters.AddWithValue("_BrandCode", "01");
                                    mycommand.Parameters.AddWithValue("_BSAppWT", "0.00");
                                    mycommand.Parameters.AddWithValue("_BSJewelWT", "0.00");
                                    mycommand.Parameters.AddWithValue("_BSStoneWT", "0.00");
                                    mycommand.Parameters.AddWithValue("_Size", "NA");
                                    mycommand.Parameters.AddWithValue("_ModelCode", "NA");
                                    mycommand.Parameters.AddWithValue("_AccessoriesAvail", "NA");
                                    mycommand.Parameters.AddWithValue("_AccessoriesMiss", "NA");

                                    mycommand.ExecuteNonQuery();


                                    // Store the new PKProdNumber in the list
                                    pkProdNumbers.Add(strProdNumber + product.CNCode);

                                    // Update lastProdNumber for the next iteration
                                    lastProdNumber = strProdNumber;
                                }
                            }

                            string DocNum = Utilities1.VoucherAutoNum("PS", main1.CNCode);
                            Console.WriteLine("DocNum: {0}", DocNum);

                            string sqlstatement1 = @"INSERT INTO tblMain1 
                                      (IC, DocNum, Voucher, UserCode, TDate, Reference, ControlNo, Remarks, CheckNo, CAmount, DE, CNCode, Void, Term, PawnTicket, BoxNo, AppraisedByCode, Appraiser, VDate, DLGDate, PartialPayment, ID) 
                                      VALUES 
                                      (@_IC, @_DocNum, @_Voucher, @_UserCode, @_TDate, @_Reference, @_ControlNo, @_Remarks, @_CheckNo, @_CAmount, @_DE, @_CNCode, @_Void, @_Term, @_PawnTicket, @_BoxNo, @_AppraisedByCode, @_Appraiser, @_VDate, @_DLGDate, @_PartialPayment, @_ID)";

                            using (var mycommand = new SqlCommand(sqlstatement1, myconnection, transaction))
                            {
                                mycommand.Parameters.AddWithValue("_IC", "PS" + DocNum + main1.CNCode);
                                mycommand.Parameters.AddWithValue("_DocNum", DocNum);
                                mycommand.Parameters.AddWithValue("_Voucher", "PS");
                                mycommand.Parameters.AddWithValue("_UserCode", main1.UserCode);
                                mycommand.Parameters.AddWithValue("_TDate", main1.TDate);
                                mycommand.Parameters.AddWithValue("_Reference", main1.PawnTicket);
                                mycommand.Parameters.AddWithValue("_ControlNo", main1.ControlNo);
                                mycommand.Parameters.AddWithValue("_Remarks", main1.Remarks);
                                mycommand.Parameters.AddWithValue("_CheckNo", "NA");
                                mycommand.Parameters.AddWithValue("_CAmount", main1.CAmount);
                                mycommand.Parameters.AddWithValue("_DE", main1.TDate);
                                mycommand.Parameters.AddWithValue("_CNCode", main1.CNCode);
                                mycommand.Parameters.AddWithValue("_Void", false);
                                mycommand.Parameters.AddWithValue("_Term", 3);
                                mycommand.Parameters.AddWithValue("_PawnTicket", main1.PawnTicket);
                                mycommand.Parameters.AddWithValue("_BoxNo", main1.BoxNo);
                                mycommand.Parameters.AddWithValue("_AppraisedByCode", "001");
                                mycommand.Parameters.AddWithValue("_Appraiser", main1.Appraiser);
                                mycommand.Parameters.AddWithValue("_VDate", main1.DLGDate);
                                mycommand.Parameters.AddWithValue("_DLGDate", main1.DLGDate);
                                mycommand.Parameters.AddWithValue("_PartialPayment", main1.PartialPayment);
                                mycommand.Parameters.AddWithValue("_ID", "NA");

                                mycommand.ExecuteNonQuery();
                            }

                            foreach (var item in main2)
                            {
                                //string LatestPKProdNumber = Utilities1.GetLatestPKNumber(main1.CNCode);
                                //Console.WriteLine(LatestPKProdNumber);

                                //Get the first added Prodnumber from the list
                                string PKProdNumber = pkProdNumbers.FirstOrDefault();

                                string sqlstatement2 = @"INSERT INTO tblMain2 
                                          (IC, PKProdNumber, RowNum, PIn, POut, IntRate, AppraisedValue, LoanAmount) 
                                          VALUES 
                                          (@_IC, @_PKProdNumber, @_RowNum, @_PIn, @_POut, @_IntRate, @_AppraisedValue, @_LoanAmount)";

                                using (var mycommand = new SqlCommand(sqlstatement2, myconnection, transaction))
                                {
                                    mycommand.Parameters.AddWithValue("_IC", "PS" + DocNum + main1.CNCode);
                                    mycommand.Parameters.AddWithValue("_PKProdNumber", PKProdNumber);
                                    mycommand.Parameters.AddWithValue("_RowNum", item.RowNum);
                                    mycommand.Parameters.AddWithValue("_PIn", "1");
                                    mycommand.Parameters.AddWithValue("_POut", "0");
                                    mycommand.Parameters.AddWithValue("_IntRate", item.IntRate);
                                    mycommand.Parameters.AddWithValue("_AppraisedValue", "0.00");
                                    mycommand.Parameters.AddWithValue("_LoanAmount", item.LoanAmount);

                                    mycommand.ExecuteNonQuery();

                                    pkProdNumbers.RemoveAt(0);
                                }
                            }

                            string sqlstatement4 = "UPDATE tblSetupBoxNo SET Available = 0 WHERE BoxNo = @BoxNo";
                            using (var mycommand = new SqlCommand(sqlstatement4, myconnection, transaction))
                            {
                                mycommand.Parameters.AddWithValue("@BoxNo", main1.BoxNo);
                                mycommand.ExecuteNonQuery();
                            }

                            transaction.Commit();

                            return Ok("Data saved successfully");
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            return BadRequest("Transaction failed: " + ex.Message);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to save data: " + ex.Message);
            }
        }


        //[HttpPost]
        //[Route("API/SCPWEBAPI/Main1Save")]
        //public IActionResult Main1Save([FromBody] Main1Model main1)
        //{
        //    try
        //    {
        //        if (main1 == null)
        //        {
        //            return BadRequest("Request cannot be null");
        //        }

        //        using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
        //        {
        //            myconnection.Open();
        //            string sqlstatement1 = @"INSERT INTO tblMain1 
        //                                  (IC, DocNum, Voucher, UserCode, TDate, Reference, ControlNo, Remarks, CheckNo, CAmount, DE, CNCode, Term, PawnTicket, BoxNo, AppraisedByCode, Appraiser, VDate, DLGDate, ID) 
        //                                  VALUES 
        //                                  (@_IC, @_DocNum, @_Voucher, @_UserCode, @_TDate, @_Reference, @_ControlNo, @_Remarks, @_CheckNo, @_CAmount, @_DE, @_CNCode, @_Term, @_PawnTicket, @_BoxNo, @_AppraisedByCode, @_Appraiser, @_VDate, @_DLGDate, @_ID)";

        //            using (var mycommand = new SqlCommand(sqlstatement1, myconnection))
        //            {
        //                mycommand.Parameters.AddWithValue("_IC", main1.IC);
        //                mycommand.Parameters.AddWithValue("_DocNum", main1.DocNum);
        //                mycommand.Parameters.AddWithValue("_Voucher", "PS");
        //                mycommand.Parameters.AddWithValue("_UserCode", main1.UserCode);
        //                mycommand.Parameters.AddWithValue("_TDate", main1.TDate);
        //                mycommand.Parameters.AddWithValue("_Reference", main1.Reference);
        //                mycommand.Parameters.AddWithValue("_ControlNo", main1.ControlNo);
        //                mycommand.Parameters.AddWithValue("_Remarks", main1.Remarks);
        //                mycommand.Parameters.AddWithValue("_CheckNo", "NA");
        //                mycommand.Parameters.AddWithValue("_CAmount", main1.CAmount);
        //                mycommand.Parameters.AddWithValue("_DE", main1.DE);
        //                mycommand.Parameters.AddWithValue("_CNCode", main1.CNCode);
        //                mycommand.Parameters.AddWithValue("_Term", main1.Term);
        //                mycommand.Parameters.AddWithValue("_PawnTicket", main1.PawnTicket);
        //                mycommand.Parameters.AddWithValue("_BoxNo", main1.BoxNo);
        //                mycommand.Parameters.AddWithValue("_AppraisedByCode", "001");
        //                mycommand.Parameters.AddWithValue("_Appraiser", main1.Appraiser);
        //                mycommand.Parameters.AddWithValue("_VDate", main1.VDate);
        //                mycommand.Parameters.AddWithValue("_DLGDate", main1.DLGDate);
        //                mycommand.Parameters.AddWithValue("_ID", "NA");

        //                mycommand.ExecuteNonQuery();
        //            }

        //            return Ok("Data saved successfully");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}


    }
}
