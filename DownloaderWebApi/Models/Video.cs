namespace DownloaderWebApi.Models
{
    public class Video
    {
        public long Id { get; set; }
        public string VideoId { get; set; }
        public string Title { get; set; }
        public string VideoPath { get; set; }
    }
}