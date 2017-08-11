using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace VehicleSelector.Data.Models
{
    public class VehicleContext : DbContext
    {
        public VehicleContext(DbContextOptions<VehicleContext> options)
            : base(options)
        { }

        public DbSet<VehicleMake> Makes { get; set; }
        public DbSet<VehicleModel> Models { get; set; }
        public DbSet<VehicleYear> Years { get; set; }
    }
}
