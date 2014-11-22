using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(membershipReboot.Startup))]
namespace membershipReboot
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
