using System.Collections.Generic;

namespace ItemsPlanning.Pn.Infrastructure.Models
{
    public class ListsModel
    {
        
        public int Total { get; set; }
        public List<ListModel> Lists { get; set; }

        public ListsModel()
        {
            Lists = new List<ListModel>();
        }
    }
}