namespace Topo.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using Topo.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<Topo.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ApplicationDbContext context)
        {
            byte[] AfrikaImage = GetResourceImage("Topo.Images.topoAfrika.png");
            string AfrikaMap = GetResourceString("Topo.Images.TopoAfrikaMap.html");

            byte[] SovjetUnieImage = GetResourceImage("Topo.Images.topoSoftjetunie.png");
            string SovjetUnieMap ="<map id='map' name='map'><area alt='C:A:Turkmenistan:' href='' coords='223,453,244,482' shape='rect'><area alt='C:B:Tadzjikistan:' href='' coords='301,472,320,488' shape='rect'><area alt='C:C:Kirgizië:' href='' coords='346,454,379,466' shape='rect'><area alt='C:D:Oezbekistan:' href='' coords='244,420,268,449' shape='rect'><area alt='B:E:moldavië:' href='' coords='64,234,78,246' shape='rect'><area alt='B:F:Estland:' href='' coords='152,164,163,173' shape='rect'><area alt='B:G:Litouwen:' href='' coords='114,162,126,173' shape='rect'><area alt='B:H:Letland:' href='' coords='124,146,135,164' shape='rect'><area alt='B:I:Georgië:' href='' coords='104,340,115,352' shape='rect'><area alt='B:J:Armenië:' href='' coords='117,374,124,393' shape='rect'><area alt='B:K:Azerbeidzjan:' href='' coords='129,376,140,390' shape='rect'><area alt='A:L:Kazachstan:' href='' coords='276,356,332,408' shape='rect'><area alt='A:M:Rusland:' href='' coords='381,234,444,286' shape='rect'><area alt='A:N:Oekraïne:' href='' coords='114,264,136,285' shape='rect'><area alt='A:O:Wit-Rusland:' href='' coords='106,210,132,227' shape='rect'><area alt='C:1:Riga:' href='' coords='132,167,149,186' shape='rect'><area alt='B:2:Nizjni Novgorod:' href='' coords='200,239,220,256' shape='rect'><area alt='A:3:Kiev:' href='' coords='80,224,111,244' shape='rect'><area alt='B:4:Samara:' href='' coords='213,277,238,299' shape='rect'><area alt='C:5:Norilsk:' href='' coords='447,200,470,228' shape='rect'><area alt='B:6:Tbilisi:' href='' coords='115,352,132,369' shape='rect'><area alt='B:7:Erevan:' href='' coords='90,369,112,384' shape='rect'><area alt='A:8:Moskou:' href='' coords='166,226,190,246' shape='rect'><area alt='C:9:Novosibirsk:' href='' coords='405,317,432,340' shape='rect'><area alt='B:10:Jekaterinburg:' href='' coords='286,280,319,297' shape='rect'><area alt='B:11:Perm:' href='' coords='266,258,298,276' shape='rect'><area alt='C:12:Tasjkent:' href='' coords='280,431,302,455' shape='rect'><area alt='B:13:Minsk:' href='' coords='100,195,134,208' shape='rect'><area alt='C:14:Vilnius:' href='' coords='102,175,131,186' shape='rect'><area alt='B:15:Bakoe:' href='' coords='140,390,156,410' shape='rect'><area alt='C:16:Tallinn:' href='' coords='151,140,165,161' shape='rect'><area alt='C:17:Bisjkek:' href='' coords='324,441,342,460' shape='rect'><area alt='C:18:Jakoetsk:' href='' coords='644,225,674,244' shape='rect'><area alt='C:19:Vladivostok:' href='' coords='764,370,785,393' shape='rect'><area alt='C:20:Irkoetsk:' href='' coords='529,354,560,369' shape='rect'><area alt='A:21:Alma Ata:' href='' coords='344,425,377,443' shape='rect'><area alt='C:22:Omsk:' href='' coords='346,310,372,335' shape='rect'><area alt='B:23:Odessa:' href='' coords='58,264,82,284' shape='rect'><area alt='C:24:Doesjanbe:' href='' coords='260,462,286,473' shape='rect'><area alt='A:25:St. Petersburg:' href='' coords='168,172,190,192' shape='rect'><area alt='C:26:Asjchabad:' href='' coords='195,432,225,451' shape='rect'><area alt='C:27:Chisinau:' href='' coords='44,245,64,259'><area alt='B:a:Barentszzee:' href='' coords='308,122,323,138' shape='rect'><area alt='A:b:Kaspische Zee:' href='' coords='153,350,171,370' shape='rect'><area alt='B:c:Lena:' href='' coords='595,258,623,282' shape='rect'><area alt='A:d:Oeral:' href='' coords='197,324,217,343' shape='rect'><area alt='A:e:Ob:' href='' coords='341,239,366,256' shape='rect'><area alt='B:f:Aralmeer:' href='' coords='232,384,250,398' shape='rect'><area alt='C:g:Don:' href='' coords='147,262,160,280' shape='rect'><area alt='B:h:Jenisej:' href='' coords='449,242,469,265' shape='rect'><area alt='C:i:Kolyma:' href='' coords='681,128,706,150' shape='rect'><area alt='B:j:Baikalmeer:' href='' coords='575,330,590,359' shape='rect'><area alt='C:k:Zee van Ochotsk:' href='' coords='764,226,800,254' shape='rect'><area alt='A:l:Zwarte Zee:' href='' coords='63,306,95,332' shape='rect'><area alt='C:m:Irtysj:' href='' coords='355,292,381,309' shape='rect'><area alt='A:n:Wolga:' href='' coords='188,283,208,301' shape='rect'><area alt='A:o:Noordelijke IJszee:' href='' coords='396,9,560,105' shape='rect'><area alt='A:I:Kaukasus:' href='' coords='131,317,152,340' shape='rect'><area alt='B:II:Nova Zembla:' href='' coords='348,103,405,150' shape='rect'></map>";

            byte[] ZuidwestAzie = GetResourceImage("Topo.Images.ZuidwestAzie.png");
            string ZuidwestAzieMap = GetResourceString("Topo.Images.ZuidwestAzieMap.html");

            byte[] Azie = GetResourceImage("Topo.Images.Azie.png");
            string AzieMap = GetResourceString("Topo.Images.AzieMap.html");

            byte[] Wereld = GetResourceImage("Topo.Images.Wereld.png");
            string WereldMap = GetResourceString("Topo.Images.WereldMap.html");

            var Kaarten = new List<TopoKaart>
            {
                new TopoKaart{
                    Categorie=Categorieen.Wereld, 
                    Title="Afrika", 
                    Image=AfrikaImage, 
                    Map=AfrikaMap
                },
                new TopoKaart{
                    Categorie=Categorieen.Wereld, 
                    Title="Voormalig Sovjet-unie", 
                    Image=SovjetUnieImage, 
                    Map=SovjetUnieMap
                },
                new TopoKaart{
                    Categorie=Categorieen.Wereld, 
                    Title="Zuid-West Azië", 
                    Image=ZuidwestAzie, 
                    Map=ZuidwestAzieMap
                },
                new TopoKaart{
                    Categorie=Categorieen.Wereld,
                    Title="kaart Wereld - Azië (Noord-Azië, Centraal-Azië, Verre Oosten, Oost-Azië, Zuidoost-Azië, Zuid-Azië, Zuidwest-Azië)",
                    Image=Azie,
                    Map=AzieMap
                },
                new TopoKaart{
                    Categorie=Categorieen.Wereld,
                    Title="kaart Wereld - continenten werelddelen oceanen bergketens en steden)",
                    Image=Wereld,
                    Map=WereldMap
                }

            };
            Kaarten.ForEach(s => context.Kaarten.AddOrUpdate(k => k.Title, s));

            if (!context.Roles.Any(r => r.Name == "Administrators"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "Administrators" };

                manager.Create(role);
            }

            if (!context.Users.Any(u => u.UserName == "Thom@Kiesewetter.nl"))
            {
                var store = new UserStore<ApplicationUser>(context);
                var manager = new UserManager<ApplicationUser>(store);
                var user = new ApplicationUser { UserName = "Thom@Kiesewetter.nl", Email = "Thom@Kiesewetter.nl", EmailConfirmed = true };

                manager.Create(user, "123456");
                manager.AddToRole(user.Id, "Administrators");
            }            

            context.SaveChanges();
        }

        private static string GetResourceString(string ResourceString)
        {
            return new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream(ResourceString)).ReadToEnd();
        }

        private static byte[] GetResourceImage(string ResourceImage)
        {
            MemoryStream m = new MemoryStream();
            Assembly.GetExecutingAssembly().GetManifestResourceStream(ResourceImage).CopyTo(m);
            return m.ToArray();
        }
    }
}
