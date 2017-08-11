using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VehicleSelector.Data.Models;

namespace VehicleSelector.Respositories
{
    public interface IVehicleMakeRepository : IRepository<VehicleMake>
    {
        
    }

    public class VehicleMakeRepository : Repository<VehicleMake>, IVehicleMakeRepository
    {
        public VehicleMakeRepository(VehicleContext context)
            : base(context)
        {
        }
        public VehicleContext _vehicleContext
        {
            get { return _context as VehicleContext; }
        }
    }
}
