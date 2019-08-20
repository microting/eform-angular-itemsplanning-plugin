using System.IO;
using System.Text;
using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace ItemsPlanning.Pn.Controllers
{
    [Authorize]
    public class ItemsListCaseController : Controller
    {
        private readonly IItemsListCaseService _listService;

        public ItemsListCaseController(IItemsListCaseService listService)
        {
            _listService = listService;
        }


        [HttpGet]
        [Route("api/items-planning-pn/list-cases/")]
        public async Task<OperationDataResult<ItemsListCasePnModel>> GetSingleList(ItemListCasesPnRequestModel requestModel)
        {
            return await _listService.GetSingleList(requestModel);
        }

        [HttpGet]
        [Route("api/items-planning-pn/list-case-results")]
        public async Task<OperationDataResult<ItemListPnCaseResultListModel>> GetSingleListResults(ItemListCasesPnRequestModel requestModel)
        {
            return await _listService.GetSingleListResults(requestModel);
        }
        
        [HttpGet]
        [Route("api/items-planning-pn/list-case-results/excel")]
        [ProducesResponseType(typeof(string), 400)]
        public async Task GenerateSingleListResults(ItemListCasesPnRequestModel requestModel)
        {
            OperationDataResult<FileStreamModel> result = await _listService.GenerateSingleListResults(requestModel);
            const int bufferSize = 4086;
            byte[] buffer = new byte[bufferSize];
            Response.OnStarting(async () =>
            {
                try
                {
                    if (!result.Success)
                    {
                        Response.ContentLength = result.Message.Length;
                        Response.ContentType = "text/plain";
                        Response.StatusCode = 400;
                        byte[] bytes = Encoding.UTF8.GetBytes(result.Message);
                        await Response.Body.WriteAsync(bytes, 0, result.Message.Length);
                        await Response.Body.FlushAsync();
                    }
                    else
                    {
                        using (FileStream excelStream = result.Model.FileStream)
                        {
                            int bytesRead;
                            Response.ContentLength = excelStream.Length;
                            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                            while ((bytesRead = excelStream.Read(buffer, 0, buffer.Length)) > 0 &&
                                   !HttpContext.RequestAborted.IsCancellationRequested)
                            {
                                await Response.Body.WriteAsync(buffer, 0, bytesRead);
                                await Response.Body.FlushAsync();
                            }
                        }
                    
                    }
                }
                finally
                {
                    if (!string.IsNullOrEmpty(result?.Model?.FilePath)
                        && System.IO.File.Exists(result.Model.FilePath))
                    {
                        System.IO.File.Delete(result.Model.FilePath);
                    }
                }
            });
            
//            return await _listService.GenerateSingleListResults(requestModel);
        }
        
    }
}