using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Topo.Controllers
{
    public class TTSController : Controller
    {
        // GET: TTS
        public ActionResult Index()
        {
            System.Net.WebClient webClient = new System.Net.WebClient();
            if (Request["q"] != "")
            {
                byte[] data = webClient.DownloadData(String.Format("http://translate.google.com/translate_tts?tl={0}&q={1}", Request["tl"], Request["q"]));
                return File(data, "audio/mpeg");
            }
            return null;
        }
    }
}