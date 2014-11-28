using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Topo.ViewModel
{
    public class PlayerKaarten : Dictionary<string, PlayerKaart> { }
    public class Game
    {
        public string CurrentPlayerName { get; set; }
        public Players Players { get; set; }
        public Game()
        {
            Players = new Players();
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
        
        public static Game importCookie(HttpCookie Cookie)
        {
            return Cookie != null ? JsonConvert.DeserializeObject<Game>(Cookie.Value) : new Game();
        }

    }
    public class Players : Dictionary<string, Player>
    {
        public void Add(string key, Player value)
        {
            if (key.Any() && key.Trim().Any() && !this.ContainsKey(key))
                base.Add(key, value);
            if (this.ContainsKey(key) && value != null) //update Player (can't clear)
                this[key] = value;
        }
    }
    public class Player
    {
        public PlayerKaarten Kaarten;
        public string CurrentKaartID;
    }
    public class PlayerKaart
    {
        public string Language;
        public string Niveau;
        public Dictionary<string, bool> Selected { get; set; }
        public Dictionary<string, int> GoodAnswers { get; set; }
        public Dictionary<string, int> WrongAnswers { get; set; }
    }

}
