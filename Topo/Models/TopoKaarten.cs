using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using HtmlAgilityPack;

namespace Topo.Models
{
    public enum Categorieen
    {
        Nederland, Europa, Wereld
    }
    public class TopoKaart
    {
        [Key]
        public int KaartID { get; set; }
        public string Title { get; set; }
        public Categorieen Categorie { get; set; }
        public byte[] Image { get; set; }
        public string Map { get; set; }
        public string Language { get; set; }

        public static TopoKaart Import(Uri URL, Categorieen Categorie)
        {
            TopoKaart Kaart = new TopoKaart();
            Kaart.Categorie = Categorie;

            System.Net.WebClient wc = new System.Net.WebClient();
            wc.Encoding = System.Text.Encoding.UTF8;
            string HtmlPage = wc.DownloadString(URL.ToString());
            HtmlDocument HtmlDoc = CreateHtmlDocument(HtmlPage);


            Kaart.Title = GetImageTitle(HtmlDoc);
            Kaart.Image = GetImage(URL, HtmlDoc); ;

            Kaart.Map = Topo.ViewModel.PlaatsenInfo.ImportMap(HtmlDoc,HtmlPage);
            return Kaart;
        }
        private static string GetImageTitle(HtmlDocument doc)
        {
            return doc.DocumentNode.SelectNodes("//img[@usemap]").Count > 0 ? doc.DocumentNode.SelectNodes("//img[@usemap]")[0].Attributes["alt"].Value.Replace("topografie", "").Replace("blinde", "").Replace("landkaart", "").Trim() : "";
        }
        private static byte[] GetImage(Uri URL, HtmlDocument doc)
        {
            if (doc.DocumentNode.SelectNodes("//img[@usemap]").Count > 0)
            {
                HtmlNode imgTagNode = doc.DocumentNode.SelectNodes("//img[@usemap]")[0];
                string ImgSrc = URL.ToString().Replace(URL.Segments[URL.Segments.Length - 1], "") + imgTagNode.Attributes["src"].Value;
                return new System.Net.WebClient().DownloadData(ImgSrc);
            }
            return null;
        }
        private static HtmlDocument CreateHtmlDocument(string HtmlPage)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(HtmlPage);
            return doc;
        }
    }

    //    @Html.DropDownList("Country", ViewData["Countries"] as SelectList, new { @class = "form-control" })
}