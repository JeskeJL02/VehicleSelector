using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VehicleSelector.Respositories;
using VehicleSelector.Data.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;

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

        // GET api/vehicles/getallmakes
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

        // GET api/vehicles/searchmodels/{id:int}/{input}
        [HttpGet("SearchModels/{id:int}/{input}")]
        public async Task<IEnumerable<VehicleModel>> SearchModels(int id, string input)
        {
            return await _vehicleModelRepository.FindAsync(x => x.VehicleMakeId == id && x.VehicleModelName.StartsWith(input));
        }

        // POST api/vehicles/addnew
        [HttpPost("AddNew")]
        public async Task<bool> AddNew([FromBody] NewItemDto newItem)
        {
            int numOfChanges = 0;
            //A bit of duplicate looking code, but we want to make sure the type matches
            // a case before we do any work, and we want to make sure work has been done
            // before we save any changes.
            switch (newItem.ItemType)
            {
                case "make":
                    {
                        await _vehicleMakeRepository.AddAsync(new VehicleMake { VehicleMakeName = newItem.ItemValue });
                        numOfChanges = await _vehicleMakeRepository.SaveChangesAsync();
                        break;
                    }
                case "model":
                    {
                        await _vehicleModelRepository.AddAsync(new VehicleModel { VehicleModelName = newItem.ItemValue, VehicleMakeId = newItem.ItemParentId });
                        numOfChanges = await _vehicleMakeRepository.SaveChangesAsync();
                        break;
                    }
            }
            //we are only expecting one change
            return numOfChanges == 1;
        }

        //DELETE api/vehicles/delete/type/id
        [HttpDelete("Delete/{type}/{id:int}")]
        public async Task<bool> Delete(string type, int id)
        {
            int numOfChanges = 0;
            //A bit of duplicate looking code, but we want to make sure the type matches
            // a case before we do any work, and we want to make sure work has been done
            // before we save any changes.
            switch (type)
            {
                case "make":
                    {
                        VehicleMake delete = await _vehicleMakeRepository.GetAsync(id);
                        if(delete != null)
                        {
                            _vehicleMakeRepository.Remove(delete);
                            numOfChanges = await _vehicleMakeRepository.SaveChangesAsync();
                        }
                        break;
                    }
                case "model":
                    {
                        VehicleModel delete = await _vehicleModelRepository.GetAsync(id);
                        if(delete != null)
                        {
                            _vehicleModelRepository.Remove(delete);
                            numOfChanges = await _vehicleMakeRepository.SaveChangesAsync();
                        }
                        break;
                    }
            }
            //we are only expecting one change
            return numOfChanges == 1;
        }
    }
}
