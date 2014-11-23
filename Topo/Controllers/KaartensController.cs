using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Topo.Dal;
using Topo.Models;

namespace Topo.Controllers
{
    public class KaartensController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Kaartens
        public ActionResult Index()
        {
            return View(db.Kaarten.ToList());
        }

        // GET: Kaartens/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Kaarten kaarten = db.Kaarten.Find(id);
            if (kaarten == null)
            {
                return HttpNotFound();
            }
            return View(kaarten);
        }

        // GET: Kaartens/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Kaartens/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "KaartID,Title,Image,Map,Language")] Kaarten kaarten)
        {
            if (ModelState.IsValid)
            {
                db.Kaarten.Add(kaarten);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(kaarten);
        }

        // GET: Kaartens/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Kaarten kaarten = db.Kaarten.Find(id);
            if (kaarten == null)
            {
                return HttpNotFound();
            }
            return View(kaarten);
        }

        // POST: Kaartens/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "KaartID,Title,Image,Map,Language")] Kaarten kaarten)
        {
            if (ModelState.IsValid)
            {
                db.Entry(kaarten).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(kaarten);
        }

        // GET: Kaartens/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Kaarten kaarten = db.Kaarten.Find(id);
            if (kaarten == null)
            {
                return HttpNotFound();
            }
            return View(kaarten);
        }

        // POST: Kaartens/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Kaarten kaarten = db.Kaarten.Find(id);
            db.Kaarten.Remove(kaarten);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
