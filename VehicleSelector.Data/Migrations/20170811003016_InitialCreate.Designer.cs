using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using VehicleSelector.Data.Models;

namespace VehicleSelector.Migrations
{
    [DbContext(typeof(VehicleContext))]
    [Migration("20170811003016_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("VehicleSelector.Data.Models.VehicleMake", b =>
                {
                    b.Property<int>("VehicleMakeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("VehicleMakeName");

                    b.HasKey("VehicleMakeId");

                    b.ToTable("Makes");
                });

            modelBuilder.Entity("VehicleSelector.Data.Models.VehicleModel", b =>
                {
                    b.Property<int>("VehicleModelId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("VehicleMakeId");

                    b.Property<string>("VehicleModelName");

                    b.HasKey("VehicleModelId");

                    b.HasIndex("VehicleMakeId");

                    b.ToTable("Models");
                });

            modelBuilder.Entity("VehicleSelector.Data.Models.VehicleYear", b =>
                {
                    b.Property<int>("VehicleYearId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("VehicleModelId");

                    b.Property<int>("VehicleYearValue");

                    b.HasKey("VehicleYearId");

                    b.HasIndex("VehicleModelId");

                    b.ToTable("Years");
                });

            modelBuilder.Entity("VehicleSelector.Data.Models.VehicleModel", b =>
                {
                    b.HasOne("VehicleSelector.Data.Models.VehicleMake", "Make")
                        .WithMany("Models")
                        .HasForeignKey("VehicleMakeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("VehicleSelector.Data.Models.VehicleYear", b =>
                {
                    b.HasOne("VehicleSelector.Data.Models.VehicleModel")
                        .WithMany("ModelYears")
                        .HasForeignKey("VehicleModelId");
                });
        }
    }
}
