using System.Text.RegularExpressions;
using System.Xml;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Topo.Models;

namespace Topo.ViewModel
{
    public class PlaatsInfo
    {
        public string Niveau { get; set; }
        public string Label { get; set; }
        public string Plaats { get; set; }
        public string Coords { get; set; }
        public string Shape { get; set; }
        public string Language { get; set; }
    }
    public class PlaatsenInfo
    {

        public static string ImportMap(HtmlDocument HtmlDoc, string HtmlPage)
        {
            Dictionary<string, PlaatsInfo> PlaatsenInfo;
            string MapTag = GetHtmlMapTag(HtmlDoc);
            PlaatsenInfo = getPlaatsen(HtmlPage);
            PlaatsenInfo = MergePlaatsInfoWithMap(MapTag, PlaatsenInfo);
            return ModelMapToHtmlMap(PlaatsenInfo);
        }
        private static string GetHtmlMapTag(HtmlDocument doc)
        {
            return doc.DocumentNode.SelectNodes("//map").Count > 0 ? doc.DocumentNode.SelectNodes("//map")[0].OuterHtml : "";
        }

        public string ToHtml()
        {
            return "";
        }
        private static string ModelMapToHtmlMap(Dictionary<string, PlaatsInfo> ViewMap)
        {
            string map = "<map id='map' name='map'>";
            foreach (KeyValuePair<string, PlaatsInfo> area in ViewMap)
            {
                map += String.Format("<area alt='{0}:{1}:{2}' href='' title='{3}' coords='{4}'>", area.Value.Niveau, area.Value.Label, area.Value.Plaats, area.Value.Label, area.Value.Coords);

            }
            return map + "</map>";
        }
        private static Dictionary<string, PlaatsInfo> MergePlaatsInfoWithMap(string Html, Dictionary<string, PlaatsInfo> plaatsen)
        {
            HtmlDocument Doc = new HtmlDocument();
            Doc.LoadHtml(Html);
            HtmlNodeCollection nodeList = Doc.DocumentNode.SelectNodes("//area");
            Dictionary<string, PlaatsInfo> ViewMap = new Dictionary<string, PlaatsInfo>();
            foreach (HtmlNode no in nodeList)
            {
                string Shape = no.Attributes["shape"].Value;
                string Coords = no.Attributes["coords"].Value;
                string Label = no.Attributes["title"].Value;
                if (plaatsen.ContainsKey(Label))
                {
                    string Plaats = plaatsen[Label].Plaats;
                    string Niveau = plaatsen[Label].Niveau;
                    if (!ViewMap.ContainsKey(Label))
                        ViewMap.Add(Label, new PlaatsInfo { Niveau = Niveau, Coords = Coords, Shape = Shape, Label = Label, Plaats = Plaats });
                }
            }
            return ViewMap;
        }
        public static string fixShape(string Html)
        {
            HtmlDocument Doc = new HtmlDocument();
            Doc.LoadHtml(Html);
            HtmlNodeCollection nodeList = Doc.DocumentNode.SelectNodes("//area");
            Dictionary<string, PlaatsInfo> ViewMap = new Dictionary<string, PlaatsInfo>();
            foreach (HtmlNode no in nodeList)
            {
                string Coords = no.Attributes["coords"].Value;
                if(Coords.Any())
                switch(Coords.Split(',').Length)
                {
                    case 3:no.Attributes.Add("shape","circle");break;
                    case 4: no.Attributes.Add("shape","rect"); break;
                    default: no.Attributes.Add("shape","poly"); break;
                }
            }
            return Doc.DocumentNode.OuterHtml;
        }
        private static Dictionary<string, PlaatsInfo> getPlaatsen(string html)
        {
            int BStart = 0;
            int CStart = 0;
            if (Regex.Matches(html, @"arrNiveauPositie(.*?);").Count > 0)
            {
                string codeline = Regex.Matches(html, @"arrNiveauPositie(.*?);")[0].Value;
                if (codeline.Split('(').Length > 0 && codeline.Split(',').Length > 2)
                {
                    string ABCStr = codeline.Split('(')[1].Replace(")", "").Replace(";", "");
                    int.TryParse(ABCStr.Split(',')[1], out BStart);
                    int.TryParse(ABCStr.Split(',')[2], out CStart);
                }
            }
            int index = 0;
            Dictionary<string, PlaatsInfo> Map = new Dictionary<string, PlaatsInfo>();
            foreach (Match Match in Regex.Matches(html, @"arrTopoItems(.*?)\=(.*?)];"))
            {
                string Codeline = Match.Groups[0].Value;
                PlaatsInfo Area = new PlaatsInfo();
                if (Regex.Matches(Codeline, @"(['])(\\?.)*?\1").Count == 2)
                {
                    Area.Plaats = Regex.Matches(Codeline, @"(['])(\\?.)*?\1")[0].Value.Trim('\'').Trim('"').Replace("\\'", "&#39;");
                    Area.Label = Regex.Matches(Codeline, @"(['])(\\?.)*?\1")[1].Value.Trim('\'').Trim('"');
                    Area.Niveau = index < BStart ? "A" : index < CStart ? "B" : "C";
                }
                index++;

                if (Area.Label != "0" && !Map.ContainsKey(Area.Label))
                {
                    Map.Add(Area.Label, Area);
                }
                //}
            }
            return (Map);
        }

        //private List<PlaatsInfo> HtmlMapToModelMapExtended(string Html)
        //{
        //    XmlDocument Doc = new XmlDocument();
        //    Doc.LoadXml(Html);
        //    XmlNodeList nodeList = Doc.SelectNodes("/area");
        //    List<PlaatsInfo> ViewMap = new List<PlaatsInfo>();
        //    foreach (XmlNode no in nodeList)
        //    {
        //        string Shape = no.Attributes["shape"].Value;
        //        string Alt = no.Attributes["alt"].Value;
        //        string Niveau = Alt.Split(':').Length > 0 ? Alt.Split(':')[0] : "";
        //        string Label = Alt.Split(':').Length > 1 ? Alt.Split(':')[1] : "";
        //        string Plaats = Alt.Split(':').Length > 2 ? Alt.Split(':')[2] : "";
        //        string Language = Alt.Split(':').Length > 3 ? Alt.Split(':')[3] : "";
        //        string Coords = no.Attributes["coords"].Value;
        //        string Title = no.Attributes["title"].Value;
        //        ViewMap.Add(new PlaatsInfo { Coords = Coords, Label = Title, Niveau = Niveau, Plaats = Plaats, Language = Language });
        //    }
        //    return ViewMap;
        //}

    }
}