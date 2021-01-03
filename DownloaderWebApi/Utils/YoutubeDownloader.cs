using System.IO;
using System.Threading.Tasks;
using VideoLibrary;

namespace DownloaderWebApi.Utils
{
    public static class YoutubeDownloader
    {
        private static string videosDir = Directory.GetCurrentDirectory() + @"\wwwroot\videos\";
        private static string link = "https://www.youtube.com/watch?v=e_k-yLShHC8";

        public static Task<string> Download(string id)
        {
            string link = $"https://www.youtube.com/watch?v={id}";
            var youTube = YouTube.Default; // starting point for YouTube actions
            var video =  youTube.GetVideo(link); // gets a Video object with info about the video
            string videoName = video.FullName.Replace(" ", "_");
            File.WriteAllBytes(videosDir + videoName, video.GetBytes());

            string[] dir = Directory.GetFiles(videosDir);
            
            
            return Task.FromResult<string>($"videos/{videoName}");




        }




    }
}