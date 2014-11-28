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
    //[RequireHttps]
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            Game Players = Game.importCookie(Request.Cookies["players"]);
            return View(Players);
        }
        [HttpPost]
        public ActionResult Index(string player, string newplayer, string StartNewPlayer)
        {
            Game Players = Game.importCookie(Request.Cookies["players"]);
            if (newplayer != null)
            {
                //PlayerKaartItem PlayerKaartItem = new PlayerKaartItem
                //{
                //    Selected = new Dictionary<string, bool>{
                //        {"A",true},
                //        {"B",false}
                //    },
                //    GoodAnswers = new Dictionary<string, int>{
                //        {"A",0},
                //        {"B",1}
                //    },
                //    WrongAnswers = new Dictionary<string, int>{
                //        {"A",1},
                //        {"B",0}
                //    },
                //};
                Player PlayerInfo = new Player
                {
                    CurrentKaartID = "1",
                    Kaarten = new PlayerKaarten{
                        {"1",new PlayerKaart
                            {
                                Niveau = "D",
                                Selected = new Dictionary<string, bool>{
                                    {"A",true},
                                    {"B",false}
                                },
                                GoodAnswers = new Dictionary<string, int>{
                                    {"A",0},
                                    {"B",1}
                                },
                                WrongAnswers = new Dictionary<string, int>{
                                    {"A",1},
                                    {"B",0}
                                },
                            }
                        }
                    }
                };
                Players.Players.Add(newplayer, PlayerInfo);
            }
            if (StartNewPlayer == "StartNewPlayer")
                Players.CurrentPlayerName = newplayer;
            else
                Players.CurrentPlayerName = player;
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