using System.Collections.Generic;
using System.Threading.Tasks;
using DownloaderWebApi.Models;
using DownloaderWebApi.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DownloaderWebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class VideosController: ControllerBase
    {
        public readonly VideoContext _context;

        public VideosController(VideoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Video>>> GetVideos()
        {
            return await _context.Videos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Video>> GetVideo(long id)
        {
            var video = await _context.Videos.FindAsync(id);

            if(video == null) return NotFound();

            return video;
        }

        [HttpPost]
        public async Task<ActionResult<Video>> PostVideo(Video video)
        {
          
            string result = await YoutubeDownloader.Download(video.VideoId);
            if(result != null){
                if(video.Title == "ByUrl"){
                    video.Title = result.Replace("/videos", "");
                }
                video.VideoPath = result;
                _context.Add(video);
                await _context.SaveChangesAsync();
                
           
                return CreatedAtAction(nameof(GetVideos), new { id = video.Id }, video ); 
            }else{
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro ao realizar o Download");
            }
            
            
            
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVideo(long id)
        {
            
            var video = await _context.Videos.FindAsync(id);

            if(video == null){
                return NotFound();
            }
            _context.Videos.Remove(video);

            await _context.SaveChangesAsync();

            return NoContent();




        }


    }
}