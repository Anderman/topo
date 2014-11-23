using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Web;
using Topo.Models;

namespace Topo.Dal
{
    public class TopoInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
            MemoryStream m = new MemoryStream();
            Assembly.GetExecutingAssembly().GetManifestResourceStream("Topo.Images.topoAfrika.png").CopyTo(m);
            byte[] AfrikaImage = m.ToArray();
            string AfrikaMap = new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream("Topo.Images.TopoAfrikaMap.html")).ReadToEnd();

            var Kaarten = new List<Kaarten>
            {
                new Kaarten{Categorie=Categorieen.Wereld, Title="Afrika",Image=AfrikaImage,Map=AfrikaMap}
            };
            Kaarten.ForEach(s => context.Kaarten.Add(s));
            context.SaveChanges();
        }

    }

}
