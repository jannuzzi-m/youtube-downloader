using System.IO;
using System.Threading.Tasks;

namespace DownloaderWebApi.Utils
{
    public static class Converter
    {
        private static string audioDir = Directory.GetCurrentDirectory() + @"\wwwroot\audios\";


        public static Task<string> ConvertVideo(string sourcePathFile)
        {

            var cuurentDirectory = Directory.GetCurrentDirectory();
            
            return Task.FromResult<string>("");
        
    
        }
    }
}