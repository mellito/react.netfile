using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backendapp.Models;
using backendapp.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendapp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeDbContext _context;
    private readonly IWebHostEnvironment _hostEnviroment;

    public EmployeeController(EmployeeDbContext context, IWebHostEnvironment hostEnviroment)
    {
        _context = context;
        _hostEnviroment = hostEnviroment;
    }
    [HttpPost]
    public async Task<ActionResult<EmployeeModel>> PostEmployeeModel([FromForm] CreateEmployeeDto employee)
    {
        EmployeeModel employeeModel = new()
        {
            EmployeeName = employee.EmployeeName,
            Occupation = employee.Occupation,
            ImageFiles = employee.ImageFiles,
            ImageName = await SaveImage(employee.ImageFiles)
        };

        _context.Employees.Add(employeeModel);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeModel>>> GetEmployees()
    {
        return await _context.Employees.Select(x => new EmployeeModel()
        {
            EmployeeId = x.EmployeeId,
            EmployeeName = x.EmployeeName,
            Occupation = x.Occupation,
            ImageName = x.ImageName,
            ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName),
        }).ToListAsync();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateEmployees(int id, [FromForm] UpdateEmployeeDto employee)
    {
        EmployeeModel employeeModel = new()
        {
            EmployeeId = employee.EmployeeId,
            EmployeeName = employee.EmployeeName,
            Occupation = employee.Occupation,
            ImageFiles = employee.ImageFiles,
            ImageName = employee.ImageName

        };
        if (id != employeeModel.EmployeeId) return BadRequest();
        if (employeeModel.ImageFiles != null)
        {
            DeleteImage(employeeModel.ImageName);
            employeeModel.ImageName = await SaveImage(employeeModel.ImageFiles);
        }
        _context.Entry(employeeModel).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EmployeeModelExists(id)) return NotFound();
        }
        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult<EmployeeModel>> DeleteEmployees(int id)
    {
        var employeeModel = await _context.Employees.FindAsync(id);
        if (employeeModel == null)
        {
            return NotFound();
        }
        DeleteImage(employeeModel.ImageName);
        _context.Employees.Remove(employeeModel);
        await _context.SaveChangesAsync();
        return employeeModel;
    }

    [NonAction]
    public bool EmployeeModelExists(int id)
    {
        return _context.Employees.Any(e => e.EmployeeId == id);
    }
    [NonAction]
    public async Task<string> SaveImage(IFormFile imageFile)
    {

        string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '_');
        imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
        var imagePath = Path.Combine(_hostEnviroment.ContentRootPath, "Images", imageName);
        using (var fileStream = new FileStream(imagePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(fileStream);
        }
        return imageName;
    }
    [NonAction]
    public void DeleteImage(string imageName)
    {

        var imagePath = Path.Combine(_hostEnviroment.ContentRootPath, "Images", imageName);
        if (System.IO.File.Exists(imagePath))
        {
            System.IO.File.Delete(imagePath);
        }
    }
}
