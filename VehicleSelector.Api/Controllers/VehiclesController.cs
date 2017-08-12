using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VehicleSelector.Respositories;
using VehicleSelector.Data.Models;
using Microsoft.AspNetCore.Cors;

namespace VehicleSelector.Api.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("api/[controller]")]
    public class VehiclesController : Controller
    {
        private readonly IVehicleMakeRepository _vehicleMakeRepository;
        private readonly IVehicleModelRepository _vehicleModelRepository;

        public VehiclesController(VehicleContext context)
        {
            _vehicleMakeRepository = new VehicleMakeRepository(context);
            _vehicleModelRepository = new VehicleModelRepository(context);
        }

        // GET api/vehicles/GetAllMakes
        [HttpGet("GetAllMakes")]
        public async Task<IEnumerable<VehicleMake>> GetAllMakes()
        {
            return await _vehicleMakeRepository.GetAllAsync();
        }

        // GET api/vehicles/searchmakes/{input}
        [HttpGet("SearchMakes/{input}")]
        public async Task<IEnumerable<VehicleMake>> SearchMakes(string input)
        {
            return await _vehicleMakeRepository.FindAsync(x => x.VehicleMakeName.StartsWith(input));
        }

        // GET api/vehicles/getmake/{id:int}
        [HttpGet("GetMake/{id:int}")]
        public async Task<VehicleMake> GetMake(int id)
        {
            return await _vehicleMakeRepository.GetMakeAndModelsAsync(id);
        }

        // GET api/vehicles/searchmakes/{id:int}/{input}
        [HttpGet("SearchModels/{id:int}/{input}")]
        public async Task<IEnumerable<VehicleModel>> SearchModels(int id, string input)
        {
            return await _vehicleModelRepository.FindAsync(x => x.VehicleMakeId == id && x.VehicleModelName.StartsWith(input));
        }
    }
}
