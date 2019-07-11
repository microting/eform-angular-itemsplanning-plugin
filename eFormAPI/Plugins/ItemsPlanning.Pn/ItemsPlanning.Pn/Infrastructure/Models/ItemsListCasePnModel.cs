using System.Collections.Generic;

namespace ItemsPlanning.Pn.Infrastructure.Models
{
    public class ItemsListCasePnModel
    {
        public List<ItemsListPnItemCaseModel> Items { get; set; }
            = new List<ItemsListPnItemCaseModel>();
    }
}