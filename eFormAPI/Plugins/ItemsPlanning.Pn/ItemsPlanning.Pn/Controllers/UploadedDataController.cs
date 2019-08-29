using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using OpenStack.NetCoreSwiftClient.Extensions;
using OpenStack.NetCoreSwiftClient.Infrastructure.Models;

namespace ItemsPlanning.Pn.Controllers
{
    public class UploadedDataController : Controller
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly IUploadedDataService _uploadedDataService;

        public UploadedDataController(IEFormCoreService coreHelper,
            IUploadedDataService uploadedDataService)
        {
            _uploadedDataService = uploadedDataService;
            _coreHelper = coreHelper;
        }

        [HttpGet]
        [Route("api/items-planning-pn/uploaded-data/get-all/{itemCaseId}")]
        public async Task<OperationDataResult<UploadedDatasModel>> GetAllUploadedDatas(int itemCaseId)
        {
            return await _uploadedDataService.GetAllUploadedDatas(itemCaseId);
        }

        [HttpGet]
        [Route("api/items-planning-pn/uploaded-data/{selectedListItemCaseId}")]
        public async Task<OperationDataResult<UploadedDataModel>> GetSingleUploadedData(int selectedListItemCaseId)
        {
            return await _uploadedDataService.GetSingleUploadedData(selectedListItemCaseId);
        }
        
        [HttpPut]
        [Route("api/items-planning-pn/uploaded-data")]
        public async Task<OperationResult> UpdateUploadedData([FromBody] UploadedDataModel uploadedDataModel)
        {
            return await _uploadedDataService.UpdateUploadedData(uploadedDataModel);
        }

        [HttpDelete]
        [Route("api/items-planning-pn/uploaded-data/{id}")]
        public async Task<OperationResult> DeleteUploadedData(int id)
        {
            return await _uploadedDataService.DeleteUploadedData(id);
        }

        [HttpPost]
        [Route("api/items-planning-pn/uploaded-data/pdf")]
        public async Task<IActionResult> UploadUploadedDataPdf(UploadedDataPDFUploadModel pdfUploadModel)
        {
            return await _uploadedDataService.UploadUploadedDataPdf(pdfUploadModel);
        }
    }
}