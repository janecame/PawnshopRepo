
namespace SCPWEBAPI.FldrModels
{
    public class SecurityModel
    {   
        public class GroupPermissionRequest
        {
            public string Groupcode { get; set; }
            public string ObjectName { get; set; }
        }

        public class User
        {
            public string UserCode { get; set; }
            public string GroupCode { get; set; }
            public string UserName { get; set; }
            public string CNCode { get; set; }
            public string FullName { get; set; }
        }

        public class UserAddDto
        {
            public string UserName { get; set; }
            public string FullName { get; set; }
            public string Password { get; set; }
            public string VerifyPassword { get; set; }

        }


    }
}
