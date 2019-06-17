using System.Collections.Generic;

namespace ItemsPlanning.Pn.Infrastructure.Models
{
    using System;
    using Microting.ItemsPlanningBase.Infrastructure.Enums;

    public class ItemsListPnModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int RepeatEvery { get; set; }
        public RepeatType RepeatType { get; set; }
        public DateTime? RepeatUntil { get; set; }
        public DayOfWeek? DayOfWeek { get; set; }
        public int? DayOfMonth { get; set; }
        public DateTime? LastExecutedTime { get; set; }
        public int RelatedEFormId { get; set; }
        public string RelatedEFormName { get; set; }

        public List<ItemsListPnItemModel> Items { get; set; }
            = new List<ItemsListPnItemModel>();
    }
}