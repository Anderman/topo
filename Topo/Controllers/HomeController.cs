using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Topo.ViewModel;
namespace Topo.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            Players Players = Players.importCookie(Request.Cookies["players"]);
            return View(Players);
        }
        [HttpPost]
        public ActionResult Index(string player, string newplayer, string StartNewPlayer)
        {
            Players Players = Players.importCookie(Request.Cookies["players"]);
            if (newplayer != null)
                Players.Namen.Add(newplayer, "");
            if (StartNewPlayer == "StartNewPlayer")
                Players.Current = newplayer;
            else
                Players.Current = player;
            HttpContext.Response.Cookies.Add(Players.toCookiePlayers());
            return View(Players);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}