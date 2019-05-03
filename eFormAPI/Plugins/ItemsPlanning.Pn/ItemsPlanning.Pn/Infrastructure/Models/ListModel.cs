using System;
using System.ComponentModel.DataAnnotations;

namespace ItemsPlanning.Pn.Infrastructure.Models
{
    public class ListModel
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [StringLength(255)]
        public string WorkflowState { get; set; }
        public int Version { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
    }
}