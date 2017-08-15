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

        // GET api/vehicles/getallmakes
        [HttpGet("GetAllMakes")]
        public async Task<IEnumerable<VehicleMake>> GetAllMakes()
        {
            IEnumerable<VehicleMake> allMakes = await _vehicleMakeRepository.GetAllAsync();
            return allMakes.OrderBy(x => x.VehicleMakeName);
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
            VehicleMake make = await _vehicleMakeRepository.GetMakeAndModelsAsync(id);
            if(make?.Models != null && make.Models.Count > 1)
            {
                //There is no way to sort the included models with entity framework unfortunately, 
                //so we have to resort to this.
                IEnumerable<VehicleModel> sortedModels = make.Models.AsEnumerable().OrderBy(x => x.VehicleModelName);
                make.Models = sortedModels.ToList();
            }
            return make;
        }

        // GET api/vehicles/searchmodels/{id:int}/{input}
        [HttpGet("SearchModels/{id:int}/{input}")]
        public async Task<IEnumerable<VehicleModel>> SearchModels(int id, string input)
        {
            return await _vehicleModelRepository.FindAsync(x => x.VehicleMakeId == id && x.VehicleModelName.StartsWith(input));
        }

        // POST api/vehicles/addnew
        // NOTE: Normally this method would be behind some sort of authentication, but the spec calls for an open api.
        [HttpPost("AddNew")]
        public async Task<int> AddNew([FromBody] NewItemDto newItem)
        {
            int newItemId = -1;
            //A bit of duplicate looking code, but we want to make sure the type matches
            // a case before we do any work, and we want to make sure work has been done
            // before we save any changes.
            switch (newItem.ItemType)
            {
                case "make":
                    {
                        VehicleMake makeToAdd = new VehicleMake { VehicleMakeName = newItem.ItemValue };
                        await _vehicleMakeRepository.AddAsync(makeToAdd);
                        await _vehicleMakeRepository.SaveChangesAsync();
                        newItemId = makeToAdd.VehicleMakeId;
                        break;
                    }
                case "model":
                    {
                        VehicleModel modelToAdd = new VehicleModel { VehicleModelName = newItem.ItemValue, VehicleMakeId = newItem.ItemParentId };
                        await _vehicleModelRepository.AddAsync(modelToAdd);
                        await _vehicleMakeRepository.SaveChangesAsync();
                        newItemId = modelToAdd.VehicleModelId;
                        break;
                    }
            }
            //we are only expecting one change
            return newItemId;
        }

        //DELETE api/vehicles/delete/type/id
        // NOTE: Normally this method would be behind some sort of authentication, but the spec calls for an open api.
        [HttpDelete("Delete/{type}/{id:int}")]
        public async Task<bool> Delete(string type, int id)
        {
            int numOfChanges = 0;
            int numOfExpectedChanges = 1;//for our VehicleMake record
            //A bit of duplicate looking code, but we want to make sure the type matches
            // a case before we do any work, and we want to make sure work has been done
            // before we save any changes.
            switch (type)
            {
                case "make":
                    {
                        VehicleMake makeToDelete = await _vehicleMakeRepository.GetAsync(id);
                        IEnumerable<VehicleModel> modelsToDelete = await _vehicleModelRepository.FindAsync(x => x.VehicleMakeId == id);
                        if(makeToDelete != null)
                        {
                            numOfExpectedChanges += modelsToDelete.Count();
                            _vehicleMakeRepository.Remove(makeToDelete);
                            _vehicleModelRepository.RemoveRange(modelsToDelete);
                            numOfChanges = await _vehicleMakeRepository.SaveChangesAsync();
                        }
                        break;
                    }
                case "model":
                    {
                        VehicleModel delete = await _vehicleModelRepository.GetAsync(id);
                        if(delete != null)
                        {
                            numOfExpectedChanges = 1;
                            _vehicleModelRepository.Remove(delete);
                            numOfChanges = await _vehicleMakeRepository.SaveChangesAsync();
                        }
                        break;
                    }
            }
            //if we delete what we expect to delete
            return numOfChanges == numOfExpectedChanges;
        }
    }
}
