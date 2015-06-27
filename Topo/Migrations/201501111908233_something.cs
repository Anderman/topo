namespace Topo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class something : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.Kaarten", newName: "TopoKaart");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.TopoKaart", newName: "Kaarten");
        }
    }
}
