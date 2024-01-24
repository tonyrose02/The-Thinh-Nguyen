using StarTEDSystem.DAL;
using StarTEDSystem.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StarTEDSystem.BLL
{
    public class EmployeeServices
    {
        #region setup the context connection
        private readonly StarTEDContext _context;

        internal EmployeeServices(StarTEDContext registercontext)
        {
            _context = registercontext;
        }
        #endregion
        public List<Employee> employyee_GetEmployee()
        {
            return _context.Employees.Where(s => s.Clubs.Any()).OrderBy(n => n.LastName).ToList();
        }
        public List<Employee> employyee_GetStaffAvailabeForClub()
        {
            return _context.Employees.Where(av => av.PositionID == 4 || av.PositionID == 5 || av.PositionID == 6).OrderBy(n => n.LastName).ToList();
        }
    }
}
