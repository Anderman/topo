using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Topo.ViewModel
{
    public class PlayerNames : Dictionary<string, string>
    {
        public void Add(string key, string value)
        {
            if (key.Any() && key.Trim().Any() && !this.ContainsKey(key))
                base.Add(key, value);
            if (this.ContainsKey(key) && value.Any() )
                this[key] = value;
        }
    }
    public class Players
    {
        public string Current { get; set; }
        public PlayerNames Namen { get; set; }
        public Players()
        {
            Namen = new PlayerNames();
        }
        public HttpCookie toCookiePlayers()
        {
            string JsonPlayers = new JavaScriptSerializer().Serialize(this);
            HttpCookie cookie = new HttpCookie("players", JsonPlayers)
            {
                Expires = DateTime.Now.AddYears(1)
            };
            return cookie;
        }
        public static Players importCookie(HttpCookie Cookie)
        {
            return Cookie != null ? JsonConvert.DeserializeObject<Players>(Cookie.Value) : new Players();
        }

    }
}
