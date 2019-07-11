namespace ItemsPlanning.Pn.Infrastructure.Models
{
    public class ItemsListPnItemCaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ItemNumber { get; set; }
        public string LocationCode { get; set; }
        public string BuildYear { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public int Status { get; set; }
        public string Comment { get; set; }
        public int NumberOfImages { get; set; }
        public int SdkCaseId { get; set; }
    }
}