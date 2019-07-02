using System;

namespace ItemsPlanning.Pn.Infrastructure.Models.Report
{
    public class GenerateReportModel
    {
        public int ItemListId { get; set; }
        public int ItemId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
