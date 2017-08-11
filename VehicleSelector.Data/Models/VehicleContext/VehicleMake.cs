using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace VehicleSelector.Data.Models
{
    public class VehicleMake
    {
        public int VehicleMakeId { get; set; }
        public string VehicleMakeName { get; set; }

        public List<VehicleModel> Models { get; set; }
    }
}

