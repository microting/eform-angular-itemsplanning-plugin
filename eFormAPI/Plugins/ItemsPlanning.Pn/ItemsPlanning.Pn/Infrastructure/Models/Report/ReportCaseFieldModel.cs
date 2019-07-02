using System.Collections.Generic;

namespace ItemsPlanning.Pn.Infrastructure.Models.Report
{
    public class ReportCaseFieldModel
    {
        public int Id { get; set; }
        public List<string> Values { get; set; } = new List<string>();
    }
}
