using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StarTEDSystem.BLL;

#region Additional Namespaces
//using StarTEDSystem.BLL;
using StarTEDSystem.DAL;
#endregion

namespace StarTEDSystem
{
    public static class StarTEDExtension
    {
        public static void STExtensions(this IServiceCollection services, Action<DbContextOptionsBuilder> options)
        {
            services.AddDbContext<StarTEDContext>(options);

            services.AddTransient<ClubServices>((serviceProvider) =>
            {
                var context = serviceProvider.GetService<StarTEDContext>();
                return new ClubServices(context);
            }
            );

            services.AddTransient<EmployeeServices>((serviceProvider) =>
            {
                var context = serviceProvider.GetService<StarTEDContext>();
                return new EmployeeServices(context);
            }
           );
        }
    }
}
