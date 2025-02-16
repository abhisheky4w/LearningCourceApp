using LearningCourceApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningCourceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseManagementAPI : ControllerBase
    {
        private readonly CourseContext _context;
        private readonly ILogger<CourseManagementAPI> _logger;

        public CourseManagementAPI(CourseContext context, ILogger<CourseManagementAPI> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("GetCourses")]
        
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses(int pageNumber = 1, int pageSize = 5)
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                {
                    _logger.LogWarning("Invalid pagination parameters: pageNumber={pageNumber}, pageSize={pageSize}", pageNumber, pageSize);

                    return BadRequest("Invalid pagination parameters.");
                }

                var courses = await _context.Courses
                    .OrderBy(c => c.Id)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                int totalCourses = await _context.Courses.CountAsync();

                return Ok(new
                {
                    Courses = courses,
                    TotalPages = (int)Math.Ceiling((double)totalCourses / pageSize),
                    CurrentPage = pageNumber
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses.");
                return StatusCode(500, "An error occurred while retrieving courses.");
            }
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetEditRecord(int id)
        {
            try
            {
                var course = await _context.Courses.FindAsync(id);
                if (course == null)
                {
                    _logger.LogWarning("Course with ID {id} not found.", id);
                    return NotFound("Course not found.");
                }
                return Ok(course);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching course with ID {id}.", id);
                return StatusCode(500, "An error occurred while fetching the course.");
            }
        }

        [HttpPost("SaveCourse")]
        public async Task<ActionResult<Course>> SaveCourse([FromBody] Course course)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState); 
                }

                _context.Courses.Add(course);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Course {Name} saved successfully with ID: {Id}", course.Name, course.Id);

                return Ok("Course saved successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving course.");
                return StatusCode(500, "An error occurred while saving the course.");
            }
        }

        
        [HttpPost("UpdateCourse")]
        public async Task<IActionResult> UpdateCourse([FromBody] Course course)
        {
            try
            {
                if (course == null || course.Id <= 0)
                {
                    return BadRequest("Invalid course data.");
                }

                var existingCourse = await _context.Courses.FindAsync(course.Id);
                if (existingCourse == null)
                {
                    _logger.LogWarning("Course with ID {id} not found.", course.Id);
                    return NotFound("Course not found.");
                }

                existingCourse.Name = course.Name;
                existingCourse.Description = course.Description;
                existingCourse.Price = course.Price;
                existingCourse.Duration = course.Duration;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Course {Id} updated successfully.", course.Id);
                return Ok("updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating course with ID {Id}.", course.Id);
                return StatusCode(500, "An error occurred while updating the course.");
            }
        }

        [HttpPost("DeleteCourse")]
        public async Task<IActionResult> DeleteCourse([FromBody] int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid course ID.");
                }

                var course = await _context.Courses.FindAsync(id);
                if (course == null)
                {
                    _logger.LogWarning("Course with ID {id} not found.", id);
                    return NotFound("Course not found.");
                }

                _context.Courses.Remove(course);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Course {Id} deleted successfully.", id);
                return Ok("Course deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting course with ID {Id}.", id);
                return StatusCode(500, "An error occurred while deleting the course.");
            }
        }
    }
}
