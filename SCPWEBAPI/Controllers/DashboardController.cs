using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    public class DashboardController : ControllerBase
    {
        // Maps the tblMain1.Voucher transaction code to a friendly label.
        // PS = New (original) pawn, RS = Renewal, RD = Redemption.
        private static string VoucherLabel(string voucher) => voucher switch
        {
            "PS" => "New Loan",
            "RS" => "Renewal",
            "RD" => "Redemption",
            _ => voucher,
        };

        [HttpGet]
        [Route("API/SCPWEBAPI/GetDashboardSummary")]
        public IActionResult GetDashboardSummary(string cnCode)
        {
            if (string.IsNullOrWhiteSpace(cnCode))
                return BadRequest("cnCode is required.");

            try
            {
                using var connection = new SqlConnection(new ClsGetConnection().PlsConnect());
                connection.Open();

                var todayCounts = GetTodayCounts(connection, cnCode);
                var pullOutReady = GetPullOutReady(connection, cnCode);
                var monthly = GetMonthly(connection, cnCode);
                var recent = GetRecent(connection, cnCode);

                var result = new
                {
                    NewLoanToday = todayCounts.NewLoan,
                    RenewalToday = todayCounts.Renewal,
                    RedemptionToday = todayCounts.Redemption,
                    PullOutReady = pullOutReady,
                    Monthly = monthly,
                    Recent = recent,
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Today's transaction counts by Voucher type (TDate = today).
        private (int NewLoan, int Renewal, int Redemption) GetTodayCounts(SqlConnection connection, string cnCode)
        {
            const string sql = @"
                SELECT
                    SUM(CASE WHEN Voucher = 'PS' THEN 1 ELSE 0 END) AS NewLoan,
                    SUM(CASE WHEN Voucher = 'RS' THEN 1 ELSE 0 END) AS Renewal,
                    SUM(CASE WHEN Voucher = 'RD' THEN 1 ELSE 0 END) AS Redemption
                FROM tblMain1
                WHERE Void = 0
                  AND CNCode = @CNCode
                  AND CAST(TDate AS date) = CAST(GETDATE() AS date)";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@CNCode", cnCode);

            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                int Nz(object v) => v == DBNull.Value ? 0 : Convert.ToInt32(v);
                return (Nz(reader["NewLoan"]), Nz(reader["Renewal"]), Nz(reader["Redemption"]));
            }
            return (0, 0, 0);
        }

        // Pawn tickets that are due for auction and not yet pulled out (the
        // actionable Pull Out queue), mirroring the Pull Out screen's logic.
        private int GetPullOutReady(SqlConnection connection, string cnCode)
        {
            const string sql = @"
                SELECT COUNT(DISTINCT PawnTicketNew)
                FROM ViewAuctionItem
                WHERE DATEDIFF(month, TDate, GETDATE()) > 5
                  AND ((VoucherNew = 'PS' AND Renewed = 0) OR VoucherNew = 'RS')
                  AND PullOut = 0
                  AND CNCode = @CNCode";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@CNCode", cnCode);
            var scalar = cmd.ExecuteScalar();
            return scalar == null || scalar == DBNull.Value ? 0 : Convert.ToInt32(scalar);
        }

        // Per-month counts for the current year, used by the line chart.
        private List<object> GetMonthly(SqlConnection connection, string cnCode)
        {
            const string sql = @"
                SELECT
                    MONTH(TDate) AS M,
                    SUM(CASE WHEN Voucher = 'PS' THEN 1 ELSE 0 END) AS NewLoan,
                    SUM(CASE WHEN Voucher = 'RS' THEN 1 ELSE 0 END) AS Renewal,
                    SUM(CASE WHEN Voucher = 'RD' THEN 1 ELSE 0 END) AS Redemption
                FROM tblMain1
                WHERE Void = 0
                  AND CNCode = @CNCode
                  AND YEAR(TDate) = YEAR(GETDATE())
                GROUP BY MONTH(TDate)";

            // Pre-fill all 12 months with zeros so the chart axis is always complete.
            var newLoan = new int[12];
            var renewal = new int[12];
            var redemption = new int[12];

            using (var cmd = new SqlCommand(sql, connection))
            {
                cmd.Parameters.AddWithValue("@CNCode", cnCode);
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    int m = Convert.ToInt32(reader["M"]) - 1;
                    if (m < 0 || m > 11) continue;
                    newLoan[m] = reader["NewLoan"] == DBNull.Value ? 0 : Convert.ToInt32(reader["NewLoan"]);
                    renewal[m] = reader["Renewal"] == DBNull.Value ? 0 : Convert.ToInt32(reader["Renewal"]);
                    redemption[m] = reader["Redemption"] == DBNull.Value ? 0 : Convert.ToInt32(reader["Redemption"]);
                }
            }

            return new List<object>
            {
                new { Name = "New Loan", Data = newLoan },
                new { Name = "Renewal", Data = renewal },
                new { Name = "Redemption", Data = redemption },
            };
        }

        // The 10 most recent transactions for the branch.
        private List<object> GetRecent(SqlConnection connection, string cnCode)
        {
            // tblMain1 holds one row per item, so group by ticket/voucher to get
            // one line per transaction with the summed amount (avoids dupes).
            const string sql = @"
                SELECT TOP 10
                    t.TDate,
                    t.PawnTicket,
                    t.Voucher,
                    t.CAmount,
                    c.CustName
                FROM (
                    SELECT
                        MAX(TDate) AS TDate,
                        PawnTicket,
                        Voucher,
                        ControlNo,
                        CNCode,
                        SUM(CAmount) AS CAmount
                    FROM tblMain1
                    WHERE Void = 0 AND CNCode = @CNCode
                    GROUP BY PawnTicket, Voucher, ControlNo, CNCode
                ) t
                LEFT JOIN tblCustomer c
                    ON t.ControlNo = c.ControlNo AND t.CNCode = c.CNCode
                ORDER BY t.TDate DESC";

            var list = new List<object>();
            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@CNCode", cnCode);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                string voucher = reader["Voucher"]?.ToString() ?? "";
                list.Add(new
                {
                    TDate = reader["TDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["TDate"]).ToString("yyyy-MM-dd"),
                    PawnTicket = reader["PawnTicket"]?.ToString(),
                    CustName = reader["CustName"]?.ToString(),
                    Type = VoucherLabel(voucher),
                    CAmount = reader["CAmount"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["CAmount"]),
                });
            }
            return list;
        }
    }
}