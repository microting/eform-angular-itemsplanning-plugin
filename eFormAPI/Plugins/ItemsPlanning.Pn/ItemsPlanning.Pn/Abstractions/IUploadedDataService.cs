using System.Threading.Tasks;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace ItemsPlanning.Pn.Abstractions
{
    public interface IUploadedDataService
    {
        Task<OperationResult> UpdateUploadedData(UploadedDataModel uploadedDataModel);
        Task<OperationResult> DeleteUploadedData(int id);
        Task<IActionResult> UploadUploadedDataPdf(UploadedDataPDFUploadModel pdfUploadModel);
        Task<IActionResult> DownloadUploadedDataPdf(string fileName);
        Task<OperationDataResult<UploadedDataModel>> GetSingleUploadedData(int selectedListItemCaseId);
        Task<OperationDataResult<UploadedDatasModel>> GetAllUploadedDatas(int itemCaseId);
    }
}