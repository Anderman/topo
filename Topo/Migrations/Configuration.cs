namespace Topo.Migrations
{
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
            MemoryStream m = new MemoryStream();
            Assembly.GetExecutingAssembly().GetManifestResourceStream("Topo.Images.topoAfrika.png").CopyTo(m);
            byte[] AfrikaImage = m.ToArray();
            string AfrikaMap = new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream("Topo.Images.TopoAfrikaMap.html")).ReadToEnd();

            var Kaarten = new List<Kaarten>
            {
                new Kaarten{
                    Categorie=Categorieen.Wereld, 
                    Title="Afrika", 
                    Image=AfrikaImage, 
                    Map=AfrikaMap
                }
            };
            Kaarten.ForEach(s => context.Kaarten.AddOrUpdate(k => k.Title, s));
            context.SaveChanges();
        }
    }
}
