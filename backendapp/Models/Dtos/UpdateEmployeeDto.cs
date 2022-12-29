using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backendapp.Models.Dtos;

public class UpdateEmployeeDto : CreateEmployeeDto
{
    public int EmployeeId { get; set; }
}
