using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.RenewalModel;





namespace SCPWEBAPI.Controllers
{


    [ApiController]
    [Route("API/SCPWEBAPI/NewRenewal")]
    public class NewRenewalController : ControllerBase
    {   


          /*[HttpPost("SaveTransactionPawnSlip")]
          public async Task<IActionResult> SaveTransactionPawnSlip([FromBody] PawnTransactionRequest request) 
          {


                if (request == null)
                {
                    return BadRequest("Invalid payload.");
                }

                try        
                {

				var autoNum = new ClsAutoNum();
				string prodNumber = await autoNum.GetNextProductNumberAsync(request.CnCode);



                // Perform your database save logic here...

                return Ok(new { 
                          status = "Success", 
                          generatedProductNumber = prodNumber,
                          receivedData = request 
                      });
                }
                catch (Exception ex)
                {
                      return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }*/

        [HttpPost("SaveTransactionPawnSlip")]
        public async Task<IActionResult> SaveTransactionPawnSlip([FromBody] PawnTransactionRequest request)
        {
            if (request == null || request.DataList == null)
                return BadRequest("Invalid payload.");

            

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                await connection.OpenAsync();
                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    try
                    {

						var newRenewal = new ClsNewRenewal();
						await newRenewal.tblStockInsert(request, connection, transaction);

						transaction.Commit();

                        return Ok(new { status = "Success", message = "Items saved successfully." });
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(500, $"Internal server error: {ex.Message}");
                    }
                }
            }
        }

        /*private void ProductSave()
        {
            try
            {
                ConnectionOpen();
                string sqlstatementstocks = "INSERT INTO tblStocks(PKProdNumber, CNCode, ProdNumber, ItemCode, MadeCode, ColorCode, ConditionCode, BirthStoneCode, DiamondSize, DiamondShapeCode, DiamondPrice, KaratCode, Weight, SerialNo, MotorNo, ChasisNo, MaturityDate, ExpDate, BSWeight, BSPcs, intrate)";
                sqlstatementstocks += "VALUES(@_PKProdNumber, @_CNCode, @_ProdNumber, @_ItemCode, @_MadeCode, @_ColorCode, @_ConditionCode, @_BirthStoneCode, @_DiamondSize, @_DiamondShapeCode, @_DiamondPrice, @_KaratCode, @_Weight, @_SerialNo, @_MotorNo, @_ChasisNo, @_MaturityDate, @_ExpDate, @_BSWeight, @_BSPcs, @_intrate)";
                DataGridViewRow row = null;
                dataTablePKProdNumber.Rows.Clear();
                for (int x = 0; x < dgvpawnitem.Rows.Count; x++)
                {
                    row = dgvpawnitem.Rows[x];
                    mycommand = new SqlCommand(sqlstatementstocks, myconnection);
                    
                    ClsAutoNumber1.ProductAdd(ClsDefaultBranch1.plsvardb);
                    
                    strProdNumber = (ClsAutoNumber1.plsnumber);

                    mycommand.Parameters.Add("_PKProdNumber", SqlDbType.Char).Value = strProdNumber + (ClsDefaultBranch1.plsvardb);
                    mycommand.Parameters.Add("_CNCode", SqlDbType.Char).Value = (ClsDefaultBranch1.plsvardb);
                    mycommand.Parameters.Add("_ProdNumber", SqlDbType.Char).Value = strProdNumber;
                    mycommand.Parameters.Add("_ItemCode", SqlDbType.Char).Value = row.Cells[12].Value;
                    mycommand.Parameters.Add("_MadeCode", SqlDbType.Char).Value = row.Cells[1].Value;
                    mycommand.Parameters.Add("_ColorCode", SqlDbType.Char).Value = row.Cells[2].Value;
                    mycommand.Parameters.Add("_ConditionCode", SqlDbType.Char).Value = row.Cells[3].Value;
                    mycommand.Parameters.Add("_BirthStoneCode", SqlDbType.Char).Value = row.Cells[4].Value;
                    mycommand.Parameters.Add("_DiamondSize", SqlDbType.SmallMoney).Value = row.Cells[13].Value;
                    mycommand.Parameters.Add("_DiamondShapeCode", SqlDbType.Char).Value = row.Cells[5].Value;
                    mycommand.Parameters.Add("_DiamondPrice", SqlDbType.Money).Value = row.Cells[14].Value;
                    mycommand.Parameters.Add("_KaratCode", SqlDbType.Char).Value = row.Cells[6].Value;
                    mycommand.Parameters.Add("_Weight", SqlDbType.VarChar).Value = row.Cells[15].Value;
                    mycommand.Parameters.Add("_SerialNo", SqlDbType.VarChar).Value = row.Cells[7].Value;
                    mycommand.Parameters.Add("_MotorNo", SqlDbType.VarChar).Value = row.Cells[8].Value;
                    mycommand.Parameters.Add("_ChasisNo", SqlDbType.VarChar).Value = row.Cells[9].Value;
                    mycommand.Parameters.Add("_MaturityDate", SqlDbType.VarChar).Value = txtMDDate.Text;
                    mycommand.Parameters.Add("_ExpDate", SqlDbType.DateTime).Value = txtExpDate.Text;
                    mycommand.Parameters.Add("_BSWeight", SqlDbType.VarChar).Value = row.Cells[16].Value;
                    mycommand.Parameters.Add("_BSPcs", SqlDbType.SmallMoney).Value = row.Cells[17].Value;
                    mycommand.Parameters.Add("_intrate", SqlDbType.Int).Value = int.Parse(double.Parse(row.Cells[10].Value.ToString()).ToString("N0"));
                    mycommand.ExecuteNonQuery();
                    dataTablePKProdNumber.Rows.Add(strProdNumber + (ClsDefaultBranch1.plsvardb));
                }
                myconnection.Close();
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }*/

        /*[HttpPost("SaveTransactionPawnSlip")]
        public IActionResult SaveTransactionPawnSlip(string object) //make it asycn
        {
            string sqlstatement1 = @"INSERT INTO tblMain1 (
            IC, 
            DocNum, 
            Voucher, 
            UserCode, 
            TDate, 
            Reference, 
            ControlNo, 
            Remarks, 
            CheckNo, 
            CAmount, 
            DE, 
            CNCode, 
            Term,
            AucDate, 
            PawnTicket, 
            WithInterest, 
            Box, 
            DatePayed, 
            PartialPayment, 
            DirectRenew

            ) Values (@_IC, @_DocNum, 
                                        @_Voucher, @_UserCode, @_TDate, @_Reference, @_ControlNo, @_Remarks,  @_CheckNo, 
                                        @_CAmount, @_DE, @_CNCode, @_Term, @_AucDate, @_PawnTicket, @_WithInterest, @_Box, 
                                        @_DatePayed, @_PartialPayment, @_DirectRenew)";

            mycommand = new SqlCommand(sqlstatement1, myconnection);

            mycommand.Parameters.Add("_IC", SqlDbType.VarChar).Value = "RS" + Form1.glbluc.Text + (ClsDefaultBranch1.plsvardb);
            mycommand.Parameters.Add("_DocNum", SqlDbType.VarChar).Value = Form1.glbluc.Text;
            mycommand.Parameters.Add("_Voucher", SqlDbType.VarChar).Value = "RS";
            mycommand.Parameters.Add("_UserCode", SqlDbType.VarChar).Value = Form1.glbluc.Text;
            mycommand.Parameters.Add("_TDate", SqlDbType.DateTime).Value = txtPawnTDate.Text;
            mycommand.Parameters.Add("_Reference", SqlDbType.VarChar).Value = "RS" + strPawnDocNum;
            mycommand.Parameters.Add("_ControlNo", SqlDbType.VarChar).Value = cboSearchControlNo.SelectedValue.ToString();
            mycommand.Parameters.Add("_Remarks", SqlDbType.VarChar).Value = txtRemarksPawn.Text;
            mycommand.Parameters.Add("_CheckNo", SqlDbType.VarChar).Value = "NA";
            mycommand.Parameters.Add("_CAmount", SqlDbType.Decimal).Value = Convert.ToDouble(txtTotalCAmount.Text);
            mycommand.Parameters.Add("_DE", SqlDbType.DateTime).Value = DateTime.Now; 
            mycommand.Parameters.Add("_CNCode", SqlDbType.Char).Value = (ClsDefaultBranch1.plsvardb);
            mycommand.Parameters.Add("_Term", SqlDbType.Int).Value = int.Parse(double.Parse(ClsGetSomething1.plsvarTermExpiration).ToString("N0"));
            mycommand.Parameters.Add("_AucDate", SqlDbType.DateTime).Value = dueDate;
            mycommand.Parameters.Add("_PawnTicket", SqlDbType.VarChar).Value = txtPawnTicket.Text;
            mycommand.Parameters.Add("_Box", SqlDbType.VarChar).Value = txtPawnBoxNum.Text;


            
        }*/
        


		
	}

}


//

