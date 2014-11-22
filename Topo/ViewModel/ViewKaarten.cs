using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Topo.ViewModel
{
    public class ViewKaarten
    {
        public int KaartID { get; set; }
        public string Title { get; set; }
        public string Map { get; set; }
        public string Language { get; set; }
    }
}
public class dataModel
{
    public int id { get; set; }
    public string map { get; set; }
}
