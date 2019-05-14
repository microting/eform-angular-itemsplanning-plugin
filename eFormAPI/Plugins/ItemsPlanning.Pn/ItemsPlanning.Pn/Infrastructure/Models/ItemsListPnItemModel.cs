namespace ItemsPlanning.Pn.Infrastructure.Models
{
    public class ItemsListPnItemModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ItemNumber { get; set; }
        public string LocationCode { get; set; }
        public int TemplateId { get; set; }
    }
}