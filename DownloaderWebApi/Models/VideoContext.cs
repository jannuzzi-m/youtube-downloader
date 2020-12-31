using Microsoft.EntityFrameworkCore;

namespace DownloaderWebApi.Models
{
    public class VideoContext: DbContext
    {
        public VideoContext(DbContextOptions options): base(options)
        {
            
        }

        public DbSet<Video> Videos { get; set; }
        
    }
}