using System;
using System.Collections.Generic;

namespace ItemsPlanning.Pn.Infrastructure.Models.Report
{
    public class ReportCaseColumnModel
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public List<ReportCaseFieldModel> Fields { get; set; } = new List<ReportCaseFieldModel>();
    }
}
