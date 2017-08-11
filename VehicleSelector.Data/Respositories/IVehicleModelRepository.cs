using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VehicleSelector.Data.Models;

namespace VehicleSelector.Respositories
{
    public interface IVehicleModelRepository : IRepository<VehicleModel>
    {
        
    }

    public class VehicleModelRepository : Repository<VehicleModel>, IVehicleModelRepository
    {
        public VehicleModelRepository(VehicleContext context)
            : base(context)
        {
        }
        public VehicleContext _vehicleContext
        {
            get { return _context as VehicleContext; }
        }
    }
}
