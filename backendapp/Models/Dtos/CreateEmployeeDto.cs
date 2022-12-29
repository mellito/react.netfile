using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backendapp.Models.Dtos;

public class CreateEmployeeDto
{

    public string EmployeeName { get; set; }
    public string Occupation { get; set; }
    public IFormFile ImageFiles { get; set; }
    public string ImageName { get; set; }
}

