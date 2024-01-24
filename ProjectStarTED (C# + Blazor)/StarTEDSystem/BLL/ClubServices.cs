using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Internal;

#region Additional Namespaces
using StarTEDSystem.DAL;
using StarTEDSystem.Entities;
#endregion

namespace StarTEDSystem.BLL
{
    public class ClubServices
    {
        #region setup the context connection
        private readonly StarTEDContext _context;

        internal ClubServices(StarTEDContext registercontext)
        {
            _context = registercontext;
        }
        #endregion

        public List<Club> Clubs_GetClubsByStatus(bool status)
        {
            return _context.Clubs.Include(c => c.Employee).Where(s => s.Active == status ).OrderBy(cn => cn.ClubName).ToList();
        }
        public Club club_GetClubByID(string id)
        {
            return _context.Clubs.FirstOrDefault(cid => cid.ClubID == id);
        }
        public int  club_ChangeStatus(Club item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("No data supplied to deactive the club");
            }

            Club exist = _context.Clubs.FirstOrDefault(cid => cid.ClubID == item.ClubID);
            if (exist == null)
            {
                throw new ArgumentException($"{item.ClubName} (id:{item.ClubID})" +
                    $" is no longer on file.");
            }
            if (exist.Active)
            {
                exist.Active = false;
            }
            else
            {
                exist.Active = true;
            }

            EntityEntry<Club> updating = _context.Entry(exist);
            updating.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            return _context.SaveChanges();
        }
        public int club_SaveChange(Club item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("No data supplied to Update the club");
            }

            bool isThere = _context.Clubs.Any(p => p.ClubID == item.ClubID);

            if (!isThere)
            {
                throw new ArgumentException($"{item.ClubName} (id:{item.ClubID})" +
                    $" is no longer on file.");
            }
            Club exist = _context.Clubs
                               .Where(p => p.ClubName.ToUpper().Equals(item.ClubName.ToUpper())
                                        && p.ClubID.ToUpper() != item.ClubID.ToUpper()
                                        && p.EmployeeID == item.EmployeeID)
                               .FirstOrDefault();
            if (exist != null)
            {
                throw new ArgumentException($"Club {item.ClubName} is already on file. Unable to update.");
            }
            EntityEntry<Club> updating = _context.Entry(item);
            updating.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            return _context.SaveChanges();
        }

        public string club_AddNewClub(Club item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("No data supplied for the new product");
            }
            Club exist = _context.Clubs
                               .Where(p => p.ClubName.ToUpper().Equals(item.ClubName.ToUpper())
                                        && p.ClubID.ToUpper().Equals(item.ClubID.ToUpper())
                                        && p.EmployeeID == item.EmployeeID)
                               .FirstOrDefault();
            if (exist != null)
            {
                throw new ArgumentException($"Club {item.ClubID}-{item.ClubName} already on file");
            }

            _context.Clubs.Add(item);

            _context.SaveChanges();

            return item.ClubID;
        }
    }
}
