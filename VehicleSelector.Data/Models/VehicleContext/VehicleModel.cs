using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace VehicleSelector.Data.Models
{
    public class VehicleModel
    {
        public int VehicleModelId { get; set; }
        public string VehicleModelName { get; set; }
        public List<VehicleYear> ModelYears { get; set; }

        public int VehicleMakeId { get; set; }
        public VehicleMake Make { get; set; }
    }
}
