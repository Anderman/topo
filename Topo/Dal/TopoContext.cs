using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Topo.Models;

namespace Topo.Dal
{
    public class TopoContext : DbContext
    {
        public TopoContext()
            : base("TopoContext")
        {
        }
        public DbSet<Kaarten> Kaarten { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}