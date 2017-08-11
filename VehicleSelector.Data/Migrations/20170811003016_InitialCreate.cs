using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace VehicleSelector.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Makes",
                columns: table => new
                {
                    VehicleMakeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    VehicleMakeName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Makes", x => x.VehicleMakeId);
                });

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    VehicleModelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    VehicleMakeId = table.Column<int>(nullable: false),
                    VehicleModelName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.VehicleModelId);
                    table.ForeignKey(
                        name: "FK_Models_Makes_VehicleMakeId",
                        column: x => x.VehicleMakeId,
                        principalTable: "Makes",
                        principalColumn: "VehicleMakeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Years",
                columns: table => new
                {
                    VehicleYearId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    VehicleModelId = table.Column<int>(nullable: true),
                    VehicleYearValue = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Years", x => x.VehicleYearId);
                    table.ForeignKey(
                        name: "FK_Years_Models_VehicleModelId",
                        column: x => x.VehicleModelId,
                        principalTable: "Models",
                        principalColumn: "VehicleModelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Models_VehicleMakeId",
                table: "Models",
                column: "VehicleMakeId");

            migrationBuilder.CreateIndex(
                name: "IX_Years_VehicleModelId",
                table: "Years",
                column: "VehicleModelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Years");

            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropTable(
                name: "Makes");
        }
    }
}
