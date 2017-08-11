using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VehicleSelector.Respositories;
using VehicleSelector.Data.Models;


namespace VehicleSelector.Api.Controllers
{
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

        // GET api/vehicles/searchmakes/{input}
        [HttpGet("SearchMakes/{input}")]
        public async Task<IEnumerable<VehicleMake>> SearchMakes(string input)
        {
            return await _vehicleMakeRepository.FindAsync(x => x.VehicleMakeName.Contains(input));
        }

        [HttpGet("GetAllMakes")]
        public async Task<IEnumerable<VehicleMake>> GetAllMakes()
        {
            return await _vehicleMakeRepository.GetAllAsync();
        }

        // GET api/values/5
        [HttpGet("GetMake/{id}")]
        public async Task<VehicleMake> GetMake(int id)
        {
            return await _vehicleMakeRepository.GetAsync(id);
        }

        [HttpGet("SearchModels/{id}/{input}")]
        public async Task<IEnumerable<VehicleModel>> GetModels(int id, string input)
        {
            return await _vehicleModelRepository.FindAsync(x => x.VehicleMakeId == id && x.VehicleModelName.Contains(input));
        }

        // POST api/values
        [HttpPost("")]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
