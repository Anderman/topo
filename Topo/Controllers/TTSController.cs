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
                string url = String.Format("http://translate.google.com/translate_tts?ie=UTF-8&tl={0}&q={1}&total=1&idx=0&textlen={2}&tk=600096&client=tw-ob&prev=input&ttsspeed=1", Request["tl"], Request["q"], Request["q"].Length);
                byte[] data = webClient.DownloadData(url);
                return File(data, "audio/mpeg");
            }
            return null;
        }
    }
}