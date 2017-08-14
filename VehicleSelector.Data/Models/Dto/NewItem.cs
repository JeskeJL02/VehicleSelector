using System;
using System.Collections.Generic;
using System.Text;

namespace VehicleSelector.Data.Models
{
    public class NewItemDto
    {
        public string ItemType { get; set; }
        public string ItemValue { get; set; }
        public int ItemParentId { get; set; }
    }
}
