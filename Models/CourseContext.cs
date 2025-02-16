using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace LearningCourceApp.Models
{
    public class CourseContext : DbContext
    {
        public CourseContext(DbContextOptions<CourseContext> options) : base(options) { }

        public DbSet<Course> Courses { get; set; }
    }
}
