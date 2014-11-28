using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using Topo.Dal;
using Topo.Models;
using Topo.ViewModel;
using HtmlAgilityPack;
using System.Text.RegularExpressions;

namespace Topo.Controllers
{
    public class TopoController : Controller
    {

        private ApplicationDbContext db = new ApplicationDbContext();
        // GET: Menu
        public ActionResult Menu()
        {
            return PartialView(db.Kaarten.ToList());
        }
        // GET: Kaartens
        public ActionResult Index()
        {
            return View(db.Kaarten.ToList());
        }
        [HttpPost]
        public ActionResult Afname(Kaarten Kaart)
        {
            db.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            if (Kaart != null && User.IsInRole("Administrators"))
            {

                db.Kaarten.Attach(Kaart);
                db.Entry(Kaart).Property(e => e.Map).IsModified = true;
                db.SaveChanges();

                return Json("Aanpassing zijn opgeslagen");
            }
            else
            {
                return Json("Onvoldiende rechten");
            }

        }
        // GET: Topo
        public ActionResult Afname(int KaartID)
        {
            ViewKaarten Kaart = (from t in db.Kaarten where t.KaartID == KaartID select new ViewKaarten { KaartID = KaartID, Map = t.Map, Title = t.Title, Language = t.Language }).FirstOrDefault();

            return View(Kaart);
        }
        public ActionResult GetImage(int KaartID)
        {
            byte[] img = (from t in db.Kaarten where t.KaartID == KaartID select t.Image).FirstOrDefault();
            return File(img, "image/jpg");
        }
        [Authorize]
        public ActionResult Import()
        {
            return View(new Kaarten());
        }
        [HttpPost]
        [Authorize]
        public ActionResult Import(Uri URL, Categorieen Categorie)
        {
            if (URL.ToString() != "")
            {
                db.Kaarten.Add(Kaarten.Import(URL, Categorie));
                db.SaveChanges();
            }
            return View();
        }

    }
}